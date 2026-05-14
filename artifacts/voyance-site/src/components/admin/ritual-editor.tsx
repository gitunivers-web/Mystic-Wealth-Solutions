import { useRef, useState } from "react";
import { Plus, Trash2, Upload, Link as LinkIcon, Video, ChevronUp, ChevronDown } from "lucide-react";

async function compressImage(file: File, maxPx = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width > height) { height = Math.round((height * maxPx) / width); width = maxPx; }
          else { width = Math.round((width * maxPx) / height); height = maxPx; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface RitualItem {
  image: string;
  description: string;
  videoUrl?: string;
}

interface RitualEditorProps {
  items: RitualItem[];
  onChange: (items: RitualItem[]) => void;
}

function RitualCard({
  item, index, total,
  onChange, onRemove, onMove,
}: {
  item: RitualItem;
  index: number;
  total: number;
  onChange: (updated: RitualItem) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [imgMode, setImgMode] = useState<"url" | "file">(item.image ? "url" : "file");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange({ ...item, image: compressed });
      setImgMode("url");
    } finally { setLoading(false); }
  };

  return (
    <div className="border border-white/10 bg-background p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-primary text-xs font-bold uppercase tracking-widest">
          Rituel {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0}
            className="p-1 text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors">
            <ChevronUp size={14} />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1}
            className="p-1 text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors">
            <ChevronDown size={14} />
          </button>
          <button type="button" onClick={onRemove}
            className="p-1 text-muted-foreground hover:text-red-400 transition-colors ml-1">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Image</span>
          <div className="flex gap-1">
            <button type="button" onClick={() => setImgMode("url")}
              className={`text-xs px-2 py-0.5 border transition-colors ${imgMode === "url" ? "border-primary text-primary" : "border-white/10 text-muted-foreground"}`}>
              <LinkIcon size={9} className="inline mr-1" />URL
            </button>
            <button type="button" onClick={() => setImgMode("file")}
              className={`text-xs px-2 py-0.5 border transition-colors ${imgMode === "file" ? "border-primary text-primary" : "border-white/10 text-muted-foreground"}`}>
              <Upload size={9} className="inline mr-1" />Fichier
            </button>
          </div>
        </div>

        {imgMode === "url" ? (
          <input type="text" value={item.image} onChange={(e) => onChange({ ...item, image: e.target.value })}
            placeholder="https://... ou /chemin-local.jpg"
            className="w-full bg-card border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
        ) : (
          <div onClick={() => fileRef.current?.click()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            className="border border-dashed border-white/20 hover:border-primary/50 cursor-pointer p-4 text-center transition-colors">
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {loading
              ? <p className="text-primary text-xs animate-pulse">Compression...</p>
              : <><Upload size={16} className="mx-auto text-muted-foreground mb-1" /><p className="text-muted-foreground text-xs">Cliquez ou glissez</p></>}
          </div>
        )}

        {item.image && (
          <div className="h-24 overflow-hidden border border-white/10">
            <img src={item.image} alt="aperçu" className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Description</span>
        <textarea
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          placeholder="Description du rituel affichée sous l'image..."
          rows={3}
          className="w-full bg-card border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
        />
      </div>

      {/* Video */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
          <Video size={10} />Vidéo (optionnelle)
        </span>
        <input type="text" value={item.videoUrl || ""}
          onChange={(e) => onChange({ ...item, videoUrl: e.target.value })}
          placeholder="YouTube, Vimeo ou /chemin-local.mp4"
          className="w-full bg-card border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
        <p className="text-muted-foreground/40 text-xs">Laissez vide si pas de vidéo pour ce rituel.</p>
      </div>
    </div>
  );
}

export function RitualEditor({ items, onChange }: RitualEditorProps) {
  const addRitual = () => {
    onChange([...items, { image: "", description: "", videoUrl: "" }]);
  };

  const updateItem = (index: number, updated: RitualItem) => {
    onChange(items.map((it, i) => (i === index ? updated : it)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const arr = [...items];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground/50 -mt-2">
        Chaque rituel apparaît dans la galerie sacrée avec son image, sa description et sa vidéo optionnelle.
      </p>

      {items.map((item, i) => (
        <RitualCard
          key={i}
          item={item}
          index={i}
          total={items.length}
          onChange={(updated) => updateItem(i, updated)}
          onRemove={() => removeItem(i)}
          onMove={(dir) => moveItem(i, dir)}
        />
      ))}

      <button
        type="button"
        onClick={addRitual}
        className="w-full border border-dashed border-white/20 hover:border-primary/50 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
      >
        <Plus size={14} />
        Ajouter un rituel
      </button>
    </div>
  );
}
