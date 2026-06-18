"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  className?: string;
  /** Texto auxiliar de acessibilidade (id do elemento de erro/descrição). */
  describedBy?: string;
  /** Chamado ao fechar (ex.: validar onBlur em formulários). */
  onBlur?: () => void;
}

interface MenuCoords {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
}

const MENU_GAP = 4;
const MENU_MAX = 280;

/**
 * Dropdown próprio, acessível e à prova de "corte".
 * A lista de opções é renderizada num portal (position: fixed) ancorado ao
 * gatilho, então nunca é cortada por containers com overflow (tabelas, modais,
 * cards). Faz flip automático para cima quando não há espaço abaixo.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecione…",
  disabled,
  invalid,
  id,
  name,
  className,
  describedBy,
  onBlur,
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => setMounted(true), []);

  const selected = options.find((o) => o.value === value) ?? null;

  const computeCoords = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
    const spaceAbove = rect.top - MENU_GAP;
    const desired = Math.min(MENU_MAX, options.length * 40 + 8);
    const openUp = spaceBelow < desired && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(desired, openUp ? spaceAbove : spaceBelow));
    setCoords({
      top: openUp ? rect.top - MENU_GAP : rect.bottom + MENU_GAP,
      left: rect.left,
      width: rect.width,
      maxHeight,
      openUp,
    });
  }, [options.length]);

  // Reposiciona ao abrir e ao rolar/redimensionar (em vez de cortar/fechar).
  useEffect(() => {
    if (!open) return;
    computeCoords();
    const onScroll = () => computeCoords();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, computeCoords]);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    onBlur?.();
  }, [onBlur]);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setActiveIndex(options.findIndex((o) => o.value === value));
    setOpen(true);
  }, [disabled, options, value]);

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  function selectAt(index: number) {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    close();
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeIndex >= 0) selectAt(activeIndex);
    } else if (e.key === "Tab") {
      close();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={selectId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${selectId}-listbox`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm outline-none transition-colors",
          invalid
            ? "border-red-400 focus:border-red-500"
            : "border-border focus:border-azul-lavanda",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <span className={cn("truncate", selected ? "text-azul-petroleo" : "text-muted")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {name && <input type="hidden" name={name} value={value} />}

      {mounted && open && coords &&
        createPortal(
          <ul
            ref={menuRef}
            id={`${selectId}-listbox`}
            role="listbox"
            tabIndex={-1}
            style={{
              position: "fixed",
              top: coords.openUp ? undefined : coords.top,
              bottom: coords.openUp ? window.innerHeight - coords.top : undefined,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxHeight,
            }}
            className="z-[100] overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-white py-1 shadow-xl"
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              const isActive = i === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => selectAt(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-azul-claro/10 text-azul-petroleo" : "text-azul-petroleo",
                    isSelected && "font-medium"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-azul-lavanda" />}
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </>
  );
}
