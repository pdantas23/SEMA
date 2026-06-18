"use client";

import { useState, useRef } from "react";
import { X, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/admin/repository";

interface GalleryUploaderProps {
  value: string[] | null;
  onChange: (urls: string[] | null) => void;
  folder?: string;
  disabled?: boolean;
}

/** Upload de múltiplas fotos (galeria/carrossel de notícias e eventos). */
export function GalleryUploader({
  value,
  onChange,
  folder = "uploads",
  disabled,
}: GalleryUploaderProps) {
  const images = value ?? [];
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setError(null);
    setUploading(true);
    try {
      const urls = [...images];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const { url } = await uploadImage(file, folder);
        urls.push(url);
      }
      onChange(urls.length > 0 ? urls : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    onChange(next.length > 0 ? next : null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((src, idx) => (
          <div key={src + idx} className="relative aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Foto ${idx + 1} da galeria`}
              className="h-full w-full rounded-lg object-cover border border-border"
            />
            {!disabled && (
              <button
                type="button"
                aria-label={`Remover foto ${idx + 1}`}
                onClick={() => removeAt(idx)}
                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          disabled={disabled || uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted transition-colors hover:border-azul-lavanda hover:bg-azul-claro/5",
            (disabled || uploading) && "opacity-60 cursor-not-allowed"
          )}
        >
          <Plus className="h-5 w-5" />
          <span className="text-[11px] font-medium">Adicionar</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
        disabled={disabled || uploading}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-xs text-muted">
          <Upload className="h-3 w-3 animate-bounce" />
          Enviando fotos…
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
