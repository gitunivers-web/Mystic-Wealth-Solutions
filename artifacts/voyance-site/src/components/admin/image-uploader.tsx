import { useRef, useState } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";

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
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ImageUploaderProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  placeholder?: string;
}

export function ImageUploader({ value, onChange, label, placeholder }: ImageUploaderProps) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
      setMode("url");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => setMode("url")}
            className={`text-xs px-2 py-0.5 border transition-colors ${mode === "url" ? "border-primary text-primary" : "border-white/10 text-muted-foreground hover:border-primary/40"}`}>
            <LinkIcon size={10} className="inline mr-1" />URL
          </button>
          <button type="button" onClick={() => setMode("file")}
            className={`text-xs px-2 py-0.5 border transition-colors ${mode === "file" ? "border-primary text-primary" : "border-white/10 text-muted-foreground hover:border-primary/40"}`}>
            <Upload size={10} className="inline mr-1" />Fichier
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "https://..."}
          className="w-full bg-background border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
        />
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-white/20 hover:border-primary/50 bg-background cursor-pointer p-6 text-center transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {loading
            ? <p className="text-primary text-xs animate-pulse">Compression en cours...</p>
            : <><Upload size={20} className="mx-auto text-muted-foreground mb-2" />
               <p className="text-muted-foreground text-xs">Cliquez ou glissez une image<br /><span className="text-muted-foreground/50">JPG, PNG, WEBP — compressé automatiquement</span></p></>
          }
        </div>
      )}

      {value && (
        <div className="relative group w-full h-28 overflow-hidden border border-white/10">
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black/70 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
