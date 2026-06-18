"use client";

import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  onEdit,
  onDelete,
  loading,
  emptyMessage = "Nenhum registro encontrado.",
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted text-sm">
        Carregando…
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex items-center justify-center py-16 text-muted text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-azul-petroleo text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-left font-semibold", col.className)}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right font-semibold">Ações</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-azul-claro/5 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3", col.className)}>
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? "—")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded px-3 py-1 text-xs font-medium border border-azul-lavanda text-azul-lavanda hover:bg-azul-lavanda hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="rounded px-3 py-1 text-xs font-medium border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
