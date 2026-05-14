import { useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";

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

interface MultiImageUploaderProps {
  values: string[];
  onChange: (vals: string[]) => void;
  label: string;
}

export function MultiImageUploader({ values, onChange, label }: MultiImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        Array.from(files).filter(f => f.type.startsWith("image/")).map(f => compressImage(f))
      );
      onChange([...values, ...results]);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...values, url]);
    setUrlInput("");
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>

      {/* Grid des images existantes */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {values.map((src, i) => (
            <div key={i} className="relative group aspect-square overflow-hidden border border-white/10">
              <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={18} className="text-white" />
              </button>
              <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-black/50 py-0.5">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-white/20 hover:border-primary/50 bg-background cursor-pointer p-5 text-center transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); }}
        />
        {loading
          ? <p className="text-primary text-xs animate-pulse">Compression en cours...</p>
          : <><Upload size={18} className="mx-auto text-muted-foreground mb-2" />
             <p className="text-muted-foreground text-xs">Cliquez ou glissez des images (plusieurs à la fois)<br /><span className="text-muted-foreground/50">JPG, PNG, WEBP</span></p></>
        }
      </div>

      {/* Ajout par URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder="Ou coller une URL d'image..."
          className="flex-1 bg-background border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={!urlInput.trim()}
          className="px-3 py-2 border border-white/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
