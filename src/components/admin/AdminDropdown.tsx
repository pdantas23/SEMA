"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

interface AdminDropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
}

export function AdminDropdown({
  options,
  value,
  onChange,
  placeholder = "Selecionar…",
  disabled,
  error,
  clearable,
}: AdminDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm bg-white text-azul-petroleo transition-colors outline-none",
          error ? "border-red-400" : open ? "border-azul-lavanda" : "border-border",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className={cn(!selected && "text-muted")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-white shadow-md overflow-hidden">
          {clearable && value && (
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="flex w-full items-center px-3 py-2 text-sm text-muted hover:bg-azul-claro/10 transition-colors"
            >
              Nenhum
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-azul-petroleo hover:bg-azul-claro/10 transition-colors"
            >
              {opt.label}
              {opt.value === value && <Check className="h-4 w-4 text-azul-petroleo" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
