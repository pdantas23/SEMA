"use client";

import { button } from "@/lib/design/tokens";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title = "Confirmar exclusão",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Excluir",
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-azul-petroleo">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={button.secondary}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Excluindo…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
