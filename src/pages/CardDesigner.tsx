import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Canvas as FabricCanvas,
  Rect,
  Textbox,
  Circle,
  Triangle as FabricTriangle,
  Line,
  FabricImage,
  FabricText,
} from 'fabric';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Type,
  Square,
  CircleIcon,
  Triangle as TriangleIcon,
  Minus,
  Trash2,
  Undo2,
  Image as ImageIcon,
  Smile,
  Plus,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const COLORS = [
  'hsl(10, 78%, 58%)',
  'hsl(175, 42%, 42%)',
  'hsl(43, 90%, 62%)',
  'hsl(250, 60%, 60%)',
  'hsl(330, 70%, 55%)',
  'hsl(0, 0%, 0%)',
  'hsl(0, 0%, 100%)',
];

const CARD_SIZES: Record<string, { width: number; height: number; label: string }> = {
  'portrait-4x6': { width: 400, height: 600, label: 'Portrait (4×6)' },
  'landscape-6x4': { width: 600, height: 400, label: 'Landscape (6×4)' },
  'square-5x5': { width: 500, height: 500, label: 'Square (5×5)' },
  'a5-portrait': { width: 420, height: 595, label: 'A5 Portrait' },
  'a5-landscape': { width: 595, height: 420, label: 'A5 Landscape' },
  'story-9-16': { width: 405, height: 720, label: 'Story (9:16)' },
};

const EMOJI_LIST = [
  '😀','😍','🥳','😎','🤩','😂','❤️','🔥','⭐','🎉',
  '🌈','🌸','🎨','🎵','✨','💫','🦋','🌺','🍀','🎈',
  '💎','🌙','☀️','🌊','🍕','🎂','🧡','💜','💙','💚',
  '🤗','🥰','😇','🤯','🫶','👏','🙌','💪','🎯','🏆',
];

/** Each page's state is stored as Fabric JSON when not active */
interface PageData {
  json: string | null; // null = blank page (not yet serialized)
}

const CardDesigner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeColor, setActiveColor] = useState(COLORS[5]);
  const [cardSize, setCardSize] = useState('portrait-4x6');
  const [emojiOpen, setEmojiOpen] = useState(false);

  // Multi-page state
  const [pages, setPages] = useState<PageData[]>([{ json: null }]);
  const [activePage, setActivePage] = useState(0);
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const activePageRef = useRef(activePage);
  activePageRef.current = activePage;

  // Preview state
  const [previewSlides, setPreviewSlides] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedSize = CARD_SIZES[cardSize];

  // Scale the canvas to fit the container while preserving aspect ratio
  const getCanvasScale = useCallback(() => {
    const maxW = Math.min(window.innerWidth - 32, 500);
    const maxH = window.innerHeight - 280;
    const scaleW = maxW / selectedSize.width;
    const scaleH = maxH / selectedSize.height;
    return Math.min(scaleW, scaleH, 1);
  }, [selectedSize]);

  /** Save the current canvas state into the active page slot (synchronously updates ref) */
  const saveCurrentPage = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON(['data']));
    const next = [...pagesRef.current];
    next[activePageRef.current] = { json };
    pagesRef.current = next;
    setPages(next);
  }, []);

  /** Load a page's JSON onto the canvas. Returns a promise that resolves when done. */
  const loadPage = useCallback(
    (pageData: PageData): Promise<void> => {
      const canvas = fabricRef.current;
      if (!canvas) return Promise.resolve();
      if (pageData.json) {
        return canvas.loadFromJSON(JSON.parse(pageData.json)).then(() => {
          canvas.renderAll();
        });
      } else {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        return Promise.resolve();
      }
    },
    [],
  );

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const scale = getCanvasScale();
    const canvas = new FabricCanvas(canvasRef.current, {
      width: selectedSize.width * scale,
      height: selectedSize.height * scale,
      backgroundColor: '#ffffff',
      selection: true,
    });
    canvas.setZoom(scale);
    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resize canvas when card size changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const scale = getCanvasScale();
    canvas.setDimensions({
      width: selectedSize.width * scale,
      height: selectedSize.height * scale,
    });
    canvas.setZoom(scale);
    canvas.renderAll();
  }, [selectedSize, getCanvasScale]);

  /** Switch to a different page */
  const switchPage = useCallback(
    (newIndex: number) => {
      if (newIndex === activePage) return;
      saveCurrentPage();
      setActivePage(newIndex);
      activePageRef.current = newIndex;
      void loadPage(pagesRef.current[newIndex]);
    },
    [activePage, saveCurrentPage, loadPage],
  );

  /** Add a new blank page */
  const addPage = useCallback(() => {
    saveCurrentPage();
    const newPages = [...pagesRef.current, { json: null }];
    const newIndex = newPages.length - 1;
    pagesRef.current = newPages;
    setPages(newPages);
    setActivePage(newIndex);
    activePageRef.current = newIndex;
    void loadPage({ json: null });
  }, [saveCurrentPage, loadPage]);

  /** Delete the current page */
  const deletePage = useCallback(() => {
    if (pagesRef.current.length <= 1) return;
    const newPages = pagesRef.current.filter((_, i) => i !== activePage);
    const newIndex = Math.min(activePage, newPages.length - 1);
    pagesRef.current = newPages;
    setPages(newPages);
    setActivePage(newIndex);
    activePageRef.current = newIndex;
    void loadPage(newPages[newIndex]);
  }, [activePage, loadPage]);

  // --- Preview ---
  const openPreview = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Save current page first (synchronously updates pagesRef)
    saveCurrentPage();
    const currentPages = [...pagesRef.current];

    const savedZoom = canvas.getZoom();
    const savedWidth = canvas.getWidth();
    const savedHeight = canvas.getHeight();
    canvas.discardActiveObject();

    // Set canvas to full card size (zoom 1) for export
    canvas.setZoom(1);
    canvas.setDimensions({
      width: selectedSize.width,
      height: selectedSize.height,
    });

    const slides: string[] = [];

    for (const page of currentPages) {
      if (page.json) {
        await canvas.loadFromJSON(JSON.parse(page.json));
      } else {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
      }
      canvas.renderAll();
      slides.push(
        canvas.toDataURL({ format: 'png', multiplier: 2 }),
      );
    }

    // Restore canvas to the active page
    canvas.setZoom(savedZoom);
    canvas.setDimensions({ width: savedWidth, height: savedHeight });
    await loadPage(currentPages[activePageRef.current]);

    setPreviewSlides(slides);
    setPreviewIndex(0);
    setPreviewOpen(true);
  }, [saveCurrentPage, selectedSize, loadPage]);

  // --- Element addition helpers ---
  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new Textbox('Tap to edit', {
      left: 50,
      top: 100,
      fontSize: 24,
      fill: activeColor,
      fontFamily: 'Nunito, sans-serif',
      width: 200,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addEmoji = (emoji: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new FabricText(emoji, {
      left: selectedSize.width / 2 - 30,
      top: selectedSize.height / 2 - 30,
      fontSize: 60,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setEmojiOpen(false);
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      FabricImage.fromURL(dataUrl).then((img) => {
        const canvas = fabricRef.current!;
        img.scaleToWidth(Math.min(200, selectedSize.width * 0.6));
        img.set({
          left: selectedSize.width / 2 - (img.getScaledWidth() / 2),
          top: selectedSize.height / 2 - (img.getScaledHeight() / 2),
        });
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addRect = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = new Rect({
      left: selectedSize.width / 2 - 50,
      top: selectedSize.height / 2 - 50,
      width: 100,
      height: 100,
      fill: activeColor,
      rx: 12,
      ry: 12,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const circle = new Circle({
      left: selectedSize.width / 2 - 50,
      top: selectedSize.height / 2 - 50,
      radius: 50,
      fill: activeColor,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const addTriangle = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const tri = new FabricTriangle({
      left: selectedSize.width / 2 - 50,
      top: selectedSize.height / 2 - 50,
      width: 100,
      height: 100,
      fill: activeColor,
    });
    canvas.add(tri);
    canvas.setActiveObject(tri);
  };

  const addLine = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const cx = selectedSize.width / 2;
    const cy = selectedSize.height / 2;
    const line = new Line([cx - 60, cy, cx + 60, cy], {
      stroke: activeColor,
      strokeWidth: 3,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const clearCanvas = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.requestRenderAll();
  };

  const handleColorClick = (color: string) => {
    setActiveColor(color);
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      if (active.type === 'line') {
        active.set('stroke', color);
      } else {
        active.set('fill', color);
      }
      canvas.requestRenderAll();
    }
  };

  const isNew = id === 'new';

  return (
    <div className="flex flex-col h-screen bg-muted overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border shrink-0">
        <button onClick={() => navigate(-1)} className="text-foreground p-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-foreground text-sm mr-auto">
          {isNew ? 'Card Designer' : 'Edit Card'}
        </h2>

        <Select value={cardSize} onValueChange={setCardSize}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CARD_SIZES).map(([key, s]) => (
              <SelectItem key={key} value={key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={openPreview}>
          <Eye size={14} />
          Preview
        </Button>
      </div>

      {/* Page tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-card border-b border-border shrink-0 overflow-x-auto">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => switchPage(i)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
              i === activePage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            Page {i + 1}
          </button>
        ))}
        <button
          onClick={addPage}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
          title="Add page"
        >
          <Plus size={16} />
        </button>
        {pages.length > 1 && (
          <button
            onClick={deletePage}
            className="p-1 rounded-md text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 ml-auto"
            title="Delete current page"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-card">
          <canvas ref={canvasRef} />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Color picker */}
      <div className="flex items-center justify-center gap-2.5 px-4 py-2 shrink-0">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              activeColor === color ? 'border-foreground scale-110' : 'border-border'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-around px-2 py-2 bg-card border-t border-border safe-area-bottom shrink-0">
        <ToolButton icon={<Type size={18} />} label="Text" onClick={addText} />
        <ToolButton icon={<ImageIcon size={18} />} label="Image" onClick={addImage} />
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-2">
              <Smile size={18} />
              <span className="text-[10px] font-semibold">Emoji</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" side="top">
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_LIST.map((em) => (
                <button
                  key={em}
                  onClick={() => addEmoji(em)}
                  className="text-xl hover:bg-accent rounded p-1 text-center"
                >
                  {em}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <ToolButton icon={<Square size={18} />} label="Rect" onClick={addRect} />
        <ToolButton icon={<CircleIcon size={18} />} label="Circle" onClick={addCircle} />
        <ToolButton icon={<TriangleIcon size={18} />} label="Triangle" onClick={addTriangle} />
        <ToolButton icon={<Minus size={18} />} label="Line" onClick={addLine} />
        <ToolButton icon={<Undo2 size={18} />} label="Clear" onClick={clearCanvas} />
        <button
          onClick={deleteSelected}
          className="flex flex-col items-center gap-0.5 text-destructive hover:text-destructive/80 transition-colors px-2"
        >
          <Trash2 size={18} />
          <span className="text-[10px] font-semibold">Delete</span>
        </button>
      </div>

      {/* Preview overlay */}
      {previewOpen && previewSlides.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <button
            onClick={() => setPreviewOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            Page {previewIndex + 1} of {previewSlides.length}
          </div>

          <img
            src={previewSlides[previewIndex]}
            alt={`Page ${previewIndex + 1}`}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />

          {previewSlides.length > 1 && (
            <>
              <button
                onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
                disabled={previewIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={() => setPreviewIndex((i) => Math.min(previewSlides.length - 1, i + 1))}
                disabled={previewIndex === previewSlides.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronRight size={36} />
              </button>

              <div className="flex gap-2 mt-6">
                {previewSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === previewIndex ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

function ToolButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-2"
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}

export default CardDesigner;
