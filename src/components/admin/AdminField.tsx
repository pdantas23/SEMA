"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function AdminField({ label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-semibold text-azul-petroleo">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function AdminInput({ error, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm bg-white text-azul-petroleo placeholder:text-muted outline-none transition-colors",
        error
          ? "border-red-400 focus:border-red-500"
          : "border-border focus:border-azul-lavanda",
        "disabled:opacity-60",
        className
      )}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function AdminTextarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm bg-white text-azul-petroleo placeholder:text-muted outline-none transition-colors resize-y min-h-[120px]",
        error
          ? "border-red-400 focus:border-red-500"
          : "border-border focus:border-azul-lavanda",
        "disabled:opacity-60",
        className
      )}
    />
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO → "dd/mm/aaaa hh:mm" no horário local. */
function isoToBr(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "dd/mm/aaaa hh:mm" (hora opcional) → ISO. null = vazio; undefined = inválido. */
function brToIso(text: string): string | null | undefined {
  const t = text.trim();
  if (!t) return null;
  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?$/);
  if (!m) return undefined;
  const [, dd, mm, yyyy, hh = "00", min = "00"] = m;
  const day = +dd, month = +mm, year = +yyyy, hour = +hh, minute = +min;
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59) return undefined;
  const d = new Date(year, month - 1, day, hour, minute);
  // Rejeita datas inexistentes (ex.: 31/02) que o Date "corrige" sozinho.
  if (d.getDate() !== day || d.getMonth() !== month - 1) return undefined;
  return d.toISOString();
}

/** Máscara progressiva: dígitos viram dd/mm/aaaa hh:mm. */
function maskDateTime(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) out += "/";
    if (i === 8) out += " ";
    if (i === 10) out += ":";
    out += digits[i];
  }
  return out;
}

interface DateTimeInputProps {
  /** ISO string (como salvo no banco) ou null. */
  value: string | null;
  onChange: (iso: string | null) => void;
  disabled?: boolean;
}

/**
 * Data e hora digitadas manualmente no formato brasileiro (dd/mm/aaaa hh:mm),
 * sem picker de calendário. Interpreta no fuso local e salva em ISO,
 * evitando o deslocamento de horário do datetime-local + toISOString.
 */
export function AdminDateTimeInput({ value, onChange, disabled }: DateTimeInputProps) {
  const [text, setText] = useState(() => isoToBr(value));
  const [invalid, setInvalid] = useState(false);

  // Sincroniza com o valor externo (ex.: registro carregado) durante o render,
  // sem sobrescrever o texto enquanto o usuário ainda está digitando.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (brToIso(text) !== value) setText(isoToBr(value));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskDateTime(e.target.value);
    setText(masked);
    setInvalid(false);
    const iso = brToIso(masked);
    if (iso !== undefined) onChange(iso);
  }

  function handleBlur() {
    setInvalid(brToIso(text) === undefined);
  }

  return (
    <div className="flex flex-col gap-1">
      <AdminInput
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa hh:mm"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        error={invalid}
        disabled={disabled}
      />
      {invalid && (
        <p className="text-xs text-red-500">
          Data inválida — use o formato dd/mm/aaaa hh:mm (hora opcional).
        </p>
      )}
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function AdminToggle({ label, checked, onChange, disabled }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-azul-lavanda",
          checked ? "bg-azul-petroleo" : "bg-gray-300",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      <span className="text-sm text-azul-petroleo">{label}</span>
    </label>
  );
}
