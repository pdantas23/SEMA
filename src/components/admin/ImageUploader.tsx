"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/admin/repository";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label = "Imagem",
  disabled,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-azul-petroleo">{label}</span>

      {value ? (
        <div className="relative w-full max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="h-40 w-full rounded-lg object-cover border border-border"
          />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer transition-colors hover:border-azul-lavanda hover:bg-azul-claro/5",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          {uploading ? (
            <span className="text-sm text-muted">Enviando…</span>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted" />
              <div className="text-sm text-muted">
                <span className="font-medium text-azul-lavanda">Clique</span> ou arraste a imagem
              </div>
              <p className="text-xs text-muted">PNG, JPG, WEBP</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled || uploading}
      />

      {!value && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">ou informe a URL:</span>
          <input
            type="url"
            placeholder="https://…"
            disabled={disabled}
            className="flex-1 rounded border border-border px-2 py-1 text-xs bg-white text-azul-petroleo outline-none focus:border-azul-lavanda"
            onBlur={(e) => e.target.value && onChange(e.target.value)}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {uploading && (
        <div className="flex items-center gap-2 text-xs text-muted">
          <Upload className="h-3 w-3 animate-bounce" />
          Enviando imagem…
        </div>
      )}
    </div>
  );
}
