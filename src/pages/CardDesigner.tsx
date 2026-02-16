import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Rect, Textbox, Circle } from 'fabric';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Type, Square, CircleIcon, Trash2, Eye, Undo2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = [
  'hsl(10, 78%, 58%)',   // primary coral
  'hsl(175, 42%, 42%)',  // teal
  'hsl(43, 90%, 62%)',   // golden
  'hsl(250, 60%, 60%)',  // indigo
  'hsl(330, 70%, 55%)',  // pink
  'hsl(0, 0%, 0%)',      // black
  'hsl(0, 0%, 100%)',    // white
];

const CardDesigner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeColor, setActiveColor] = useState(COLORS[5]);

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      const containerWidth = containerRef.current?.clientWidth || 350;
      const canvasWidth = Math.min(containerWidth - 32, 400);
      const canvasHeight = Math.round(canvasWidth * 1.4);

      fabricRef.current = new FabricCanvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#ffffff',
      });
    }

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, []);

  const addText = () => {
    const text = new Textbox('Tap to edit', {
      left: 50,
      top: 100,
      fontSize: 24,
      fill: activeColor,
      fontFamily: 'Nunito',
      width: 200,
    });
    fabricRef.current?.add(text);
    fabricRef.current?.setActiveObject(text);
  };

  const addRect = () => {
    const rect = new Rect({
      left: 60,
      top: 60,
      width: 100,
      height: 100,
      fill: activeColor,
      rx: 12,
      ry: 12,
    });
    fabricRef.current?.add(rect);
    fabricRef.current?.setActiveObject(rect);
  };

  const addCircle = () => {
    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: activeColor,
    });
    fabricRef.current?.add(circle);
    fabricRef.current?.setActiveObject(circle);
  };

  const deleteSelected = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      fabricRef.current?.remove(active);
      fabricRef.current?.discardActiveObject();
      fabricRef.current?.requestRenderAll();
    }
  };

  const clearCanvas = () => {
    fabricRef.current?.clear();
    fabricRef.current!.backgroundColor = '#ffffff';
    fabricRef.current?.requestRenderAll();
  };

  const isNew = id === 'new';

  return (
    <div ref={containerRef} className="flex flex-col h-screen bg-muted">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <button onClick={() => navigate(-1)} className="text-foreground p-1">
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-bold text-foreground text-sm">
          {isNew ? 'New Card' : 'Edit Card'}
        </h2>
        <Button size="sm" variant="outline" className="rounded-full text-xs">
          <Eye size={14} className="mr-1" /> Preview
        </Button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-card">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Color picker */}
      <div className="flex items-center justify-center gap-2.5 px-4 py-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              activeColor === color ? 'border-foreground scale-110' : 'border-border'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-around px-4 py-3 bg-card border-t border-border safe-area-bottom">
        <button onClick={addText} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Type size={20} />
          <span className="text-[10px] font-semibold">Text</span>
        </button>
        <button onClick={addRect} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Square size={20} />
          <span className="text-[10px] font-semibold">Rect</span>
        </button>
        <button onClick={addCircle} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <CircleIcon size={20} />
          <span className="text-[10px] font-semibold">Circle</span>
        </button>
        <button onClick={clearCanvas} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Undo2 size={20} />
          <span className="text-[10px] font-semibold">Clear</span>
        </button>
        <button onClick={deleteSelected} className="flex flex-col items-center gap-1 text-destructive hover:text-destructive/80 transition-colors">
          <Trash2 size={20} />
          <span className="text-[10px] font-semibold">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default CardDesigner;
