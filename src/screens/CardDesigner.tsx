"use client";

import { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import FoldableCard3D from '@/components/FoldableCard3D';
import {
  Canvas as FabricCanvas,
  Rect,
  Textbox,
  Circle,
  Triangle as FabricTriangle,
  Line,
  FabricImage,
  FabricText,
  Polygon,
  Ellipse,
  Polyline,
  PencilBrush,
} from 'fabric';
import { useRouter, useParams } from 'next/navigation';
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
  Shapes,
  Pencil,
  Slash,
  Diamond,
  Hexagon,
  Pentagon,
  Star,
  Heart,
  Octagon,
  ArrowRight,
  Spline,
  Settings,
  BookOpen,
  FlipHorizontal,
  FlipVertical,
  ArrowRightLeft,
  ArrowUpDown,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createCard } from '@/lib/api';
import { AspectRatio } from '@/types';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

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
  'portrait-4x6': { width: 400, height: 600, label: 'Portrait (4\u00d76)' },
  'landscape-6x4': { width: 600, height: 400, label: 'Landscape (6\u00d74)' },
  'square-5x5': { width: 500, height: 500, label: 'Square (5\u00d75)' },
  'a5-portrait': { width: 420, height: 595, label: 'A5 Portrait' },
  'a5-landscape': { width: 595, height: 420, label: 'A5 Landscape' },
  'story-9-16': { width: 405, height: 720, label: 'Story (9:16)' },
};

const TRANSITIONS = [
  { id: 'slide-h', label: 'Horizontal Slide', icon: ArrowRightLeft, description: 'Slides left/right between pages' },
  { id: 'slide-v', label: 'Vertical Slide', icon: ArrowUpDown, description: 'Slides up/down between pages' },
  { id: 'flip-h', label: 'Horizontal Flip', icon: FlipHorizontal, description: 'Flips the page horizontally to reveal the next' },
  { id: 'flip-v', label: 'Vertical Flip', icon: FlipVertical, description: 'Flips the page vertically to reveal the next' },
  { id: 'book', label: 'Page Flip', icon: BookOpen, description: 'Opens like physical book pages' },
] as const;

type TransitionId = typeof TRANSITIONS[number]['id'];

const EMOJI_LIST = [
  '\u{1F600}', '\u{1F60D}', '\u{1F973}', '\u{1F60E}', '\u{1F929}', '\u{1F602}', '\u2764\uFE0F', '\u{1F525}', '\u2B50', '\u{1F389}',
  '\u{1F308}', '\u{1F338}', '\u{1F3A8}', '\u{1F3B5}', '\u2728', '\u{1F4AB}', '\u{1F98B}', '\u{1F33A}', '\u{1F340}', '\u{1F388}',
  '\u{1F48E}', '\u{1F319}', '\u2600\uFE0F', '\u{1F30A}', '\u{1F355}', '\u{1F382}', '\u{1F9E1}', '\u{1F49C}', '\u{1F499}', '\u{1F49A}',
  '\u{1F917}', '\u{1F970}', '\u{1F607}', '\u{1F92F}', '\u{1FAF6}', '\u{1F44F}', '\u{1F64C}', '\u{1F4AA}', '\u{1F3AF}', '\u{1F3C6}',
];

const BRUSH_SIZES = [2, 4, 8, 14, 22];

interface PageData {
  json: string | null;
}

// --- Polygon point generators ---
function starPoints(cx: number, cy: number, outerR: number, innerR: number, n: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / n) * i - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return pts;
}

function regularPolygonPoints(cx: number, cy: number, r: number, n: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI / n) * i - Math.PI / 2;
    pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return pts;
}

function heartPoints(cx: number, cy: number, size: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = (i / 30) * 2 * Math.PI;
    const x = size * 16 * Math.pow(Math.sin(t), 3) / 17;
    const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;
    pts.push({ x: cx + x, y: cy + y });
  }
  return pts;
}

function arrowPoints(cx: number, cy: number, size: number) {
  const w = size;
  const h = size * 0.6;
  const shaft = h * 0.3;
  return [
    { x: cx - w / 2, y: cy - shaft / 2 },
    { x: cx + w / 6, y: cy - shaft / 2 },
    { x: cx + w / 6, y: cy - h / 2 },
    { x: cx + w / 2, y: cy },
    { x: cx + w / 6, y: cy + h / 2 },
    { x: cx + w / 6, y: cy + shaft / 2 },
    { x: cx - w / 2, y: cy + shaft / 2 },
  ];
}

// --- Transition CSS helpers ---
function getTransitionStyle(
  transition: TransitionId,
  direction: 'enter' | 'exit',
  goingForward: boolean,
): React.CSSProperties {
  switch (transition) {
    case 'slide-h':
      return {
        animation: `${direction === 'enter' ? 'slideInH' : 'slideOutH'} 0.45s ease-in-out forwards`,
        ['--dir' as string]: goingForward ? '1' : '-1',
      };
    case 'slide-v':
      return {
        animation: `${direction === 'enter' ? 'slideInV' : 'slideOutV'} 0.45s ease-in-out forwards`,
        ['--dir' as string]: goingForward ? '1' : '-1',
      };
    case 'flip-h':
      return {
        animation: `${direction === 'enter' ? (goingForward ? 'flipInHFwd' : 'flipInHBwd') : (goingForward ? 'flipOutHFwd' : 'flipOutHBwd')} 0.35s ${direction === 'exit' ? 'ease-in' : 'ease-out'} forwards`,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
      };
    case 'flip-v':
      return {
        animation: `${direction === 'enter' ? (goingForward ? 'flipInVFwd' : 'flipInVBwd') : (goingForward ? 'flipOutVFwd' : 'flipOutVBwd')} 0.35s ${direction === 'exit' ? 'ease-in' : 'ease-out'} forwards`,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
      };
    default:
      return {};
  }
}

// Keyframes injected once
const TRANSITION_KEYFRAMES = `
@keyframes slideInH {
  from { transform: translateX(calc(100% * var(--dir))); }
  to { transform: translateX(0); }
}
@keyframes slideOutH {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% * var(--dir))); }
}
@keyframes slideInV {
  from { transform: translateY(calc(100% * var(--dir))); }
  to { transform: translateY(0); }
}
@keyframes slideOutV {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% * var(--dir))); }
}

/* Horizontal card flip forward — clockwise (left-to-right) */
@keyframes flipOutHFwd {
  0%   { transform: perspective(800px) rotateY(0deg) scale(1); }
  100% { transform: perspective(800px) rotateY(-90deg) scale(0.92); }
}
@keyframes flipInHFwd {
  0%   { transform: perspective(800px) rotateY(90deg) scale(0.92); }
  100% { transform: perspective(800px) rotateY(0deg) scale(1); }
}

/* Horizontal card flip backward — counterclockwise (right-to-left) */
@keyframes flipOutHBwd {
  0%   { transform: perspective(800px) rotateY(0deg) scale(1); }
  100% { transform: perspective(800px) rotateY(90deg) scale(0.92); }
}
@keyframes flipInHBwd {
  0%   { transform: perspective(800px) rotateY(-90deg) scale(0.92); }
  100% { transform: perspective(800px) rotateY(0deg) scale(1); }
}

/* Vertical card flip forward — top tilts away */
@keyframes flipOutVFwd {
  0%   { transform: perspective(800px) rotateX(0deg) scale(1); }
  100% { transform: perspective(800px) rotateX(-90deg) scale(0.92); }
}
@keyframes flipInVFwd {
  0%   { transform: perspective(800px) rotateX(90deg) scale(0.92); }
  100% { transform: perspective(800px) rotateX(0deg) scale(1); }
}

/* Vertical card flip backward — bottom tilts away (opposite direction) */
@keyframes flipOutVBwd {
  0%   { transform: perspective(800px) rotateX(0deg) scale(1); }
  100% { transform: perspective(800px) rotateX(90deg) scale(0.92); }
}
@keyframes flipInVBwd {
  0%   { transform: perspective(800px) rotateX(-90deg) scale(0.92); }
  100% { transform: perspective(800px) rotateX(0deg) scale(1); }
}

`;



// ============================================================

const CardDesigner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const { id } = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [activeColor, setActiveColor] = useState(COLORS[5]);
  const [cardSize, setCardSize] = useState('portrait-4x6');
  const [transition, setTransition] = useState<TransitionId>('slide-h');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [shapesOpen, setShapesOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Save state
  const [saveOpen, setSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cardTitle, setCardTitle] = useState('Untitled Card');
  const [cardCreator, setCardCreator] = useState('');

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDir, setTransitionDir] = useState<'exit' | 'enter' | null>(null);
  const [goingForward, setGoingForward] = useState(true);
  const [is3DCardOpen, setIs3DCardOpen] = useState(false)
  const [is3DMode, setIs3DMode] = useState(false) // New state for inline 3D view;

  const selectedSize = CARD_SIZES[cardSize];

  const getCanvasScale = useCallback(() => {
    const maxW = Math.min(window.innerWidth - 32, 500);
    const maxH = window.innerHeight - 280;
    const scaleW = maxW / selectedSize.width;
    const scaleH = maxH / selectedSize.height;
    return Math.min(scaleW, scaleH, 1);
  }, [selectedSize]);

  const saveCurrentPage = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const json = JSON.stringify((canvas as any).toJSON(['data']));
    const next = [...pagesRef.current];
    next[activePageRef.current] = { json };
    pagesRef.current = next;
    setPages(next);
  }, []);

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

  // Sync drawing mode & brush
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = isDrawing;
    if (isDrawing) {
      const brush = new PencilBrush(canvas);
      brush.color = activeColor;
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;
    }
  }, [isDrawing, activeColor, brushSize]);

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
    saveCurrentPage();
    const currentPages = [...pagesRef.current];
    const savedZoom = canvas.getZoom();
    const savedWidth = canvas.getWidth();
    const savedHeight = canvas.getHeight();
    canvas.discardActiveObject();
    canvas.isDrawingMode = false;

    canvas.setZoom(1);
    canvas.setDimensions({ width: selectedSize.width, height: selectedSize.height });

    const slides: string[] = [];
    for (const page of currentPages) {
      if (page.json) {
        await canvas.loadFromJSON(JSON.parse(page.json));
      } else {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
      }
      canvas.renderAll();
      slides.push(canvas.toDataURL({ format: 'png', multiplier: 2 }));
    }

    canvas.setZoom(savedZoom);
    canvas.setDimensions({ width: savedWidth, height: savedHeight });
    await loadPage(currentPages[activePageRef.current]);

    // Ensure we have 4 slides for the 3D card (Front, InsideLeft, InsideRight, Back)
    while (slides.length < 4) {
      slides.push(''); // Empty string or a default white placeholder will be handled by the component if needed, 
      // but ideally we should generate a blank white image. 
      // For now, let's reuse the last slide or a blank canvas if we want to be precise, 
      // but simply pushing empty strings might break the image src.
      // Let's generate a blank white slide.
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      slides.push(canvas.toDataURL({ format: 'png', multiplier: 2 }));
    }
    // We only need the first 4 for the foldable card
    setPreviewSlides(slides.slice(0, 4));

    setPreviewIndex(0);
    setTransitionDir(null);
    setIs3DCardOpen(false); // Start closed
    setPreviewOpen(true);
  }, [saveCurrentPage, selectedSize, loadPage]);

  const navigatePreview = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === previewIndex) return;
    if (newIndex < 0 || newIndex >= previewSlides.length) return;

    const forward = newIndex > previewIndex;
    setGoingForward(forward);
    setIsTransitioning(true);

    // Phase 1: Exit — animate old slide out
    setTransitionDir('exit');

    // Determine exit duration based on transition type
    const exitMs = transition.startsWith('flip') ? 350 : 450;
    const enterMs = transition.startsWith('flip') ? 350 : 450;

    setTimeout(() => {
      // Swap to new slide
      setPreviewIndex(newIndex);
      // Phase 2: Enter — animate new slide in
      setTransitionDir('enter');

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDir(null);
      }, enterMs);
    }, exitMs);
  }, [isTransitioning, previewIndex, previewSlides.length, transition]);

  // --- Helpers ---
  const cx = selectedSize.width / 2;
  const cy = selectedSize.height / 2;

  const exitDrawingMode = () => {
    setIsDrawing(false);
    if (fabricRef.current) fabricRef.current.isDrawingMode = false;
  };

  // --- Element adders ---
  const addText = () => {
    exitDrawingMode();
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new Textbox('Tap to edit', {
      left: 50, top: 100, fontSize: 24, fill: activeColor,
      fontFamily: 'Nunito, sans-serif', width: 200,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addEmoji = (emoji: string) => {
    exitDrawingMode();
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new FabricText(emoji, { left: cx - 30, top: cy - 30, fontSize: 60 });
    canvas.add(text);
    canvas.setActiveObject(text);
    setEmojiOpen(false);
  };

  const addImage = () => {
    exitDrawingMode();
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
          left: cx - img.getScaledWidth() / 2,
          top: cy - img.getScaledHeight() / 2,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // --- Save ---
  const handleSaveClick = () => {
    setSaveOpen(true);
  };

  const mapSizeToAspectRatio = (sizeKey: string): AspectRatio => {
    if (sizeKey.includes('landscape')) return 'landscape';
    if (sizeKey.includes('square')) return 'square';
    if (sizeKey.includes('story')) return 'tall';
    return 'portrait';
  };

  const handleConfirmSave = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      setSaving(true);
      // Ensure current page is saved to state
      saveCurrentPage();

      // Generate thumbnail from current view
      // We might want to temporarily reset zoom to 1 to get a clean screenshot, 
      // but usually toDataURL works on the current canvas state.
      // Let's use a multiplier to get decent quality.
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 0.5 });

      const newCard = {
        title: cardTitle || 'Untitled Card',
        creator: cardCreator || 'Anonymous',
        image: dataUrl,
        category: 'custom', // Default category
        aspectRatio: mapSizeToAspectRatio(cardSize),
      };

      await createCard(newCard);

      toast.success('Card saved successfully!');
      setSaveOpen(false);

      // Optional: Redirect to explore or viewer
      // router.push('/'); 
    } catch (error) {
      console.error('Failed to save card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- Shapes ---
  const addShape = (type: string) => {
    exitDrawingMode();
    const canvas = fabricRef.current;
    if (!canvas) return;
    let obj;
    switch (type) {
      case 'rect':
        obj = new Rect({ left: cx - 50, top: cy - 50, width: 100, height: 100, fill: activeColor, rx: 8, ry: 8 });
        break;
      case 'square':
        obj = new Rect({ left: cx - 50, top: cy - 50, width: 100, height: 100, fill: activeColor });
        break;
      case 'circle':
        obj = new Circle({ left: cx - 50, top: cy - 50, radius: 50, fill: activeColor });
        break;
      case 'ellipse':
        obj = new Ellipse({ left: cx - 60, top: cy - 35, rx: 60, ry: 35, fill: activeColor });
        break;
      case 'triangle':
        obj = new FabricTriangle({ left: cx - 50, top: cy - 50, width: 100, height: 100, fill: activeColor });
        break;
      case 'diamond':
        obj = new Polygon(
          [{ x: 50, y: 0 }, { x: 100, y: 60 }, { x: 50, y: 120 }, { x: 0, y: 60 }],
          { left: cx - 50, top: cy - 60, fill: activeColor },
        );
        break;
      case 'pentagon':
        obj = new Polygon(regularPolygonPoints(50, 50, 50, 5), { left: cx - 50, top: cy - 50, fill: activeColor });
        break;
      case 'hexagon':
        obj = new Polygon(regularPolygonPoints(50, 50, 50, 6), { left: cx - 50, top: cy - 50, fill: activeColor });
        break;
      case 'octagon':
        obj = new Polygon(regularPolygonPoints(50, 50, 50, 8), { left: cx - 50, top: cy - 50, fill: activeColor });
        break;
      case 'star':
        obj = new Polygon(starPoints(50, 50, 50, 22, 5), { left: cx - 50, top: cy - 50, fill: activeColor });
        break;
      case 'star6':
        obj = new Polygon(starPoints(50, 50, 50, 28, 6), { left: cx - 50, top: cy - 50, fill: activeColor });
        break;
      case 'heart':
        obj = new Polygon(heartPoints(50, 50, 3), { left: cx - 50, top: cy - 50, fill: activeColor });
        break;
      case 'arrow':
        obj = new Polygon(arrowPoints(60, 40, 120), { left: cx - 60, top: cy - 40, fill: activeColor });
        break;
      default:
        return;
    }
    canvas.add(obj);
    canvas.setActiveObject(obj);
    setShapesOpen(false);
  };

  // --- Lines ---
  const addLine = (type: string) => {
    exitDrawingMode();
    const canvas = fabricRef.current;
    if (!canvas) return;
    const x1 = cx - 60, y1 = cy, x2 = cx + 60, y2 = cy;
    let obj;
    switch (type) {
      case 'solid':
        obj = new Line([x1, y1, x2, y2], { stroke: activeColor, strokeWidth: 3 });
        break;
      case 'dashed':
        obj = new Line([x1, y1, x2, y2], { stroke: activeColor, strokeWidth: 3, strokeDashArray: [10, 5] });
        break;
      case 'dotted':
        obj = new Line([x1, y1, x2, y2], { stroke: activeColor, strokeWidth: 3, strokeDashArray: [2, 4] });
        break;
      case 'thick':
        obj = new Line([x1, y1, x2, y2], { stroke: activeColor, strokeWidth: 8, strokeLineCap: 'round' });
        break;
      case 'diagonal':
        obj = new Line([cx - 50, cy - 50, cx + 50, cy + 50], { stroke: activeColor, strokeWidth: 3 });
        break;
      case 'zigzag': {
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i <= 8; i++) {
          pts.push({ x: cx - 60 + i * 15, y: cy + (i % 2 === 0 ? -12 : 12) });
        }
        obj = new Polyline(pts, { stroke: activeColor, strokeWidth: 2, fill: 'transparent' });
        break;
      }
      case 'curve': {
        const curvePts: { x: number; y: number }[] = [];
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          curvePts.push({ x: cx - 60 + t * 120, y: cy + Math.sin(t * Math.PI * 2) * 20 });
        }
        obj = new Polyline(curvePts, { stroke: activeColor, strokeWidth: 2, fill: 'transparent' });
        break;
      }
      default:
        return;
    }
    canvas.add(obj);
    canvas.setActiveObject(obj);
    setLinesOpen(false);
  };

  // --- Drawing ---
  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    setDrawOpen(false);
  };

  const selectBrushSize = (size: number) => {
    setBrushSize(size);
    setIsDrawing(true);
    setDrawOpen(false);
  };

  // --- Actions ---
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
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
    const active = canvas.getActiveObject();
    if (active) {
      if (active.type === 'line' || active.type === 'polyline') {
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
      {/* Inject transition keyframes */}
      <style dangerouslySetInnerHTML={{ __html: TRANSITION_KEYFRAMES }} />

      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border shrink-0">
        <button onClick={() => router.back()} className="text-foreground p-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-foreground text-sm mr-auto">
          {isNew ? 'Card Designer' : 'Edit Card'}
        </h2>

        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={14} />
          {!isMobile && <span>Settings</span>}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1"
          onClick={openPreview}
        >
          <Eye size={14} />
          {!isMobile && <span>Preview</span>}
        </Button>


        <Button
          size="sm"
          className="h-8 text-xs gap-1 ml-2"
          onClick={handleSaveClick}
        >
          <Save size={14} />
          <span>Save</span>
        </Button>
      </div>

      {/* Page tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-card border-b border-border shrink-0 overflow-x-auto">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => switchPage(i)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${i === activePage ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
          >
            Page {i + 1}
          </button>
        ))}
        <button onClick={addPage} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0" title="Add page">
          <Plus size={16} />
        </button>
        {pages.length > 1 && (
          <button onClick={deletePage} className="p-1 rounded-md text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 ml-auto" title="Delete current page">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative bg-gray-50/50">

        {/* Main Content: 2D Canvas OR 3D Card */}
        <div className="relative flex items-center justify-center w-full h-full">
          {is3DMode && (
            <div className="animate-in fade-in zoom-in duration-300 absolute inset-0 z-10 flex items-center justify-center bg-gray-50/50">
              <FoldableCard3D
                frontImage={previewSlides[0]}
                innerLeftImage={previewSlides[1]}
                innerRightImage={previewSlides[2]}
                backImage={previewSlides[3]}
                isOpen={is3DCardOpen}
                onToggle={() => setIs3DCardOpen(!is3DCardOpen)}
                width={selectedSize.width * 0.6}
                height={selectedSize.height * 0.6}
              />
            </div>
          )}

          <div className={`rounded-[3px] overflow-hidden shadow-2xl bg-white border border-gray-200 ${is3DMode ? 'opacity-0 pointer-events-none' : ''}`}>
            <canvas ref={canvasRef} />
          </div>

          {/* Toggle Button on the Interface */}
          <div className="absolute bottom-8 z-50">
            <Button
              variant={is3DMode ? "default" : "secondary"}
              size="lg"
              className="shadow-xl rounded-full px-8 font-bold transition-all hover:scale-105 active:scale-95"
              onClick={async () => {
                if (!is3DMode) {
                  // Generating preview before showing
                  await openPreview();
                  setIs3DCardOpen(false); // Start closed
                  setIs3DMode(true);
                } else {
                  // If already in 3D, this button could toggle fold? 
                  // User asked for "Open/Close" button.
                  // Let's make THIS button the "Open/Close" button when in 3D?
                  // Or separate?
                  // User: "add the open button... text will change to close..."
                  if (is3DCardOpen) {
                    setIs3DCardOpen(false);
                  } else {
                    setIs3DCardOpen(true);
                  }
                }
              }}
            >
              {is3DMode ? (is3DCardOpen ? "Close Card" : "Open Card") : "Preview 3D"}
            </Button>

            {is3DMode && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-full ml-4 rounded-full shadow-lg bg-white"
                onClick={() => setIs3DMode(false)}
                title="Back to Editing"
              >
                <X size={20} />
              </Button>
            )}
          </div>

        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Color picker */}
      <div className="flex items-center justify-center gap-2.5 px-4 py-2 shrink-0">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className={`w-7 h-7 rounded-full border-2 transition-all ${activeColor === color ? 'border-foreground scale-110' : 'border-border'}`}
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
                <button key={em} onClick={() => addEmoji(em)} className="text-xl hover:bg-accent rounded p-1 text-center">{em}</button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={shapesOpen} onOpenChange={setShapesOpen}>
          <PopoverTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-2">
              <Shapes size={18} />
              <span className="text-[10px] font-semibold">Shapes</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="top">
            <div className="grid grid-cols-4 gap-1">
              <ShapeBtn icon={<Square size={20} />} label="Rect" onClick={() => addShape('rect')} />
              <ShapeBtn icon={<SquareIcon />} label="Square" onClick={() => addShape('square')} />
              <ShapeBtn icon={<CircleIcon size={20} />} label="Circle" onClick={() => addShape('circle')} />
              <ShapeBtn icon={<EllipseIcon />} label="Ellipse" onClick={() => addShape('ellipse')} />
              <ShapeBtn icon={<TriangleIcon size={20} />} label="Triangle" onClick={() => addShape('triangle')} />
              <ShapeBtn icon={<Diamond size={20} />} label="Diamond" onClick={() => addShape('diamond')} />
              <ShapeBtn icon={<Pentagon size={20} />} label="Pentagon" onClick={() => addShape('pentagon')} />
              <ShapeBtn icon={<Hexagon size={20} />} label="Hexagon" onClick={() => addShape('hexagon')} />
              <ShapeBtn icon={<Octagon size={20} />} label="Octagon" onClick={() => addShape('octagon')} />
              <ShapeBtn icon={<Star size={20} />} label="Star 5" onClick={() => addShape('star')} />
              <ShapeBtn icon={<Star6Icon />} label="Star 6" onClick={() => addShape('star6')} />
              <ShapeBtn icon={<Heart size={20} />} label="Heart" onClick={() => addShape('heart')} />
              <ShapeBtn icon={<ArrowRight size={20} />} label="Arrow" onClick={() => addShape('arrow')} />
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={linesOpen} onOpenChange={setLinesOpen}>
          <PopoverTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-2">
              <Slash size={18} />
              <span className="text-[10px] font-semibold">Lines</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="top">
            <div className="grid grid-cols-1 gap-0.5">
              <LineBtn label="Solid" preview={<Minus size={18} />} onClick={() => addLine('solid')} />
              <LineBtn label="Dashed" preview={<DashedLineIcon />} onClick={() => addLine('dashed')} />
              <LineBtn label="Dotted" preview={<DottedLineIcon />} onClick={() => addLine('dotted')} />
              <LineBtn label="Thick" preview={<ThickLineIcon />} onClick={() => addLine('thick')} />
              <LineBtn label="Diagonal" preview={<Slash size={18} />} onClick={() => addLine('diagonal')} />
              <LineBtn label="Zigzag" preview={<Spline size={18} />} onClick={() => addLine('zigzag')} />
              <LineBtn label="Curve" preview={<CurveIcon />} onClick={() => addLine('curve')} />
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={drawOpen} onOpenChange={setDrawOpen}>
          <PopoverTrigger asChild>
            <button className={`flex flex-col items-center gap-0.5 transition-colors px-2 ${isDrawing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Pencil size={18} />
              <span className="text-[10px] font-semibold">Draw</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" side="top">
            <div className="space-y-3">
              <button
                onClick={toggleDrawing}
                className={`w-full text-left text-sm font-medium px-2 py-1.5 rounded-md transition-colors ${isDrawing ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
              </button>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Brush Size</p>
                <div className="flex items-center gap-2">
                  {BRUSH_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => selectBrushSize(size)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${brushSize === size && isDrawing ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-accent'}`}
                      title={`${size}px`}
                    >
                      <span className="rounded-full bg-foreground" style={{ width: Math.min(size, 20), height: Math.min(size, 20) }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <ToolButton icon={<Undo2 size={18} />} label="Clear" onClick={clearCanvas} />
        <button onClick={deleteSelected} className="flex flex-col items-center gap-0.5 text-destructive hover:text-destructive/80 transition-colors px-2">
          <Trash2 size={18} />
          <span className="text-[10px] font-semibold">Delete</span>
        </button>
      </div>

      {/* Settings drawer */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className={isMobile ? 'w-full sm:max-w-full' : ''}>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Configure your card size and page transitions.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Page Size</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CARD_SIZES).map(([key, s]) => (
                  <button
                    key={key}
                    onClick={() => setCardSize(key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${cardSize === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30 hover:bg-accent/50'
                      }`}
                  >
                    {/* Mini preview of aspect ratio */}
                    <div
                      className={`border-2 rounded-sm ${cardSize === key ? 'border-primary' : 'border-muted-foreground/40'}`}
                      style={{
                        width: Math.round((s.width / Math.max(s.width, s.height)) * 36),
                        height: Math.round((s.height / Math.max(s.width, s.height)) * 36),
                      }}
                    />
                    <span className="text-xs font-medium">{s.label}</span>
                    <span className="text-[10px] text-muted-foreground">{s.width} &times; {s.height}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transition */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Page Transition</h3>
              <div className="space-y-1.5">
                {TRANSITIONS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTransition(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${transition === t.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-accent/50'
                        }`}
                    >
                      <Icon size={20} className={transition === t.id ? 'text-primary' : 'text-muted-foreground'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-[11px] text-muted-foreground">{t.description}</p>
                      </div>
                      {transition === t.id && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent >
      </Sheet >

      {/* Preview overlay */}



      {/* Save Dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save your card</DialogTitle>
            <DialogDescription>
              Give your card a title and sign your name before sharing it with the world.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Card Title</Label>
              <Input
                id="title"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="e.g., Happy Birthday Mom"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="creator">Creator Name</Label>
              <Input
                id="creator"
                value={cardCreator}
                onChange={(e) => setCardCreator(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div >
  );
};

// --- Small helper components ---

function ToolButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-2">
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}

function ShapeBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors" title={label}>
      {icon}
      <span className="text-[9px] text-muted-foreground">{label}</span>
    </button>
  );
}

function LineBtn({ label, preview, onClick }: { label: string; preview: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left">
      <span className="text-muted-foreground">{preview}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

// --- Inline SVG mini-icons ---

function SquareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" />
    </svg>
  );
}

function EllipseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="10" ry="6" />
    </svg>
  );
}

function Star6Icon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 14.5,8.5 21,9.5 16,14 17.5,21 12,17.5 6.5,21 8,14 3,9.5 9.5,8.5" />
    </svg>
  );
}

function DashedLineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4">
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function DottedLineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 4" strokeLinecap="round">
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function ThickLineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function CurveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 18 C8 4, 16 20, 22 6" />
    </svg>
  );
}

export default CardDesigner;
