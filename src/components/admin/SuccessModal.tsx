"use client";

import { CheckCircle } from "lucide-react";

/**
 * Popup de confirmação exibido após salvar no admin.
 * O editor mostra `open` e redireciona para a listagem em seguida.
 */
export function SuccessModal({
  open,
  message = "Salvo com sucesso!",
}: {
  open: boolean;
  message?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-azul-petroleo/30 px-4 backdrop-blur-sm"
      role="alertdialog"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-7 text-center shadow-xl">
        <CheckCircle className="h-12 w-12 text-green-600" aria-hidden="true" />
        <p className="text-base font-semibold text-azul-petroleo">{message}</p>
        <p className="text-sm text-muted">Redirecionando…</p>
      </div>
    </div>
  );
}

export default SuccessModal;
