"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Eye,
  Copy,
  X,
  Download,
  Search,
  Loader2,
} from "lucide-react";
import { leadsRepo } from "@/lib/admin/repository";
import type { Lead } from "@/lib/types";
import { AdminInput } from "@/components/admin/AdminField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Select, type SelectOption } from "@/components/shared/Select";
import { button, card } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  "Novo",
  "Em contato",
  "Orçamento enviado",
  "Em negociação",
  "Fechado",
  "Perdido",
] as const;

const ETIQUETA_OPTIONS = ["Qualificado", "Não qualificado"] as const;

const toOptions = (arr: readonly string[]): SelectOption[] =>
  arr.map((v) => ({ value: v, label: v }));

// Opções dos filtros (com "todos") e dos campos de edição (com vazio "—").
const STATUS_FILTER_OPTS: SelectOption[] = [
  { value: "todos", label: "Todos" },
  ...toOptions(STATUS_OPTIONS),
];
const ETIQUETA_FILTER_OPTS: SelectOption[] = [
  { value: "todos", label: "Todas" },
  ...toOptions(ETIQUETA_OPTIONS),
];
const STATUS_EDIT_OPTS: SelectOption[] = [
  { value: "", label: "—" },
  ...toOptions(STATUS_OPTIONS),
];
const ETIQUETA_EDIT_OPTS: SelectOption[] = [
  { value: "", label: "—" },
  ...toOptions(ETIQUETA_OPTIONS),
];

const FATURAMENTO_MAP: Record<string, string> = {
  ate_100mil: "Até R$ 100 mil",
  "100mil_500mil": "R$ 100 mil a R$ 500 mil",
  "500mil_1mi": "R$ 500 mil a R$ 1 milhão",
  "1mi_5mi": "R$ 1 milhão a R$ 5 milhões",
  "5mi_acima": "Acima de R$ 5 milhões",
};

const LIMIT = 25;

function statusBadgeClass(status: string | null): string {
  switch (status) {
    case "Novo":
      return "bg-blue-50 text-blue-700";
    case "Em contato":
      return "bg-amber-50 text-amber-700";
    case "Orçamento enviado":
      return "bg-violet-50 text-violet-700";
    case "Em negociação":
      return "bg-cyan-50 text-cyan-700";
    case "Fechado":
      return "bg-green-50 text-green-700";
    case "Perdido":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getTimeAgo(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins}m`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 30) return `há ${days}d`;
  return new Date(createdAt).toLocaleDateString("pt-BR");
}

function normalizarTelefone(telefone?: string | null): string {
  const digits = (telefone || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function montarLinkWhatsApp(lead: Lead): string {
  const telefone = normalizarTelefone(lead.telefone);
  if (!telefone) return "";
  const nome = lead.nome || "tudo bem";
  const necessidade = lead.necessidade || "não informada";
  const msg = `Olá ${nome}! Vi seu cadastro no formulário da SEMA. Necessidade informada: ${necessidade}. Como posso te ajudar?`;
  return `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`;
}

function fmtFaturamento(v: string | null): string {
  if (!v) return "-";
  return FATURAMENTO_MAP[v] || v;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroEtiqueta, setFiltroEtiqueta] = useState("todos");
  const [pagina, setPagina] = useState(1);

  const [leadVisualizando, setLeadVisualizando] = useState<Lead | null>(null);
  const [editando, setEditando] = useState<Lead | null>(null);
  const [editData, setEditData] = useState<Partial<Lead>>({});
  const [salvando, setSalvando] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLeads(
        await leadsRepo.list({ status: filtroStatus, etiqueta: filtroEtiqueta })
      );
    } catch (err) {
      notify((err as Error).message || "Erro ao carregar leads", false);
    } finally {
      setLoading(false);
    }
  }, [filtroStatus, filtroEtiqueta, notify]);

  useEffect(() => {
    load();
  }, [load]);

  // Busca textual aplicada no cliente (sobre o resultado já filtrado no banco).
  const leadsFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.nome?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.telefone?.includes(busca.trim()) ||
        l.necessidade?.toLowerCase().includes(q)
    );
  }, [leads, busca]);

  const totalPaginas = Math.max(1, Math.ceil(leadsFiltrados.length / LIMIT));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * LIMIT;
  const leadsPaginados = leadsFiltrados.slice(inicio, inicio + LIMIT);

  const stats = useMemo(() => {
    const by = (s: string) =>
      leads.filter((l) => l.status_comercial === s).length;
    return {
      total: leads.length,
      novos: by("Novo"),
      emContato: by("Em contato"),
      fechados: by("Fechado"),
    };
  }, [leads]);

  function abrirWhatsApp(lead: Lead) {
    const link = montarLinkWhatsApp(lead);
    if (!link) {
      notify("Lead sem telefone válido para WhatsApp", false);
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
  }

  async function copiar(texto: string, msg = "Copiado!") {
    try {
      await navigator.clipboard.writeText(texto);
      notify(msg);
    } catch {
      notify("Não foi possível copiar", false);
    }
  }

  async function salvarEdicao() {
    if (!editando) return;
    setSalvando(true);
    try {
      const patch: Partial<Lead> = {
        status_comercial: editData.status_comercial,
        etiqueta: editData.etiqueta,
        segmentacao: editData.segmentacao ?? null,
      };
      await leadsRepo.update(editando.id, patch);
      setLeads((prev) =>
        prev.map((l) => (l.id === editando.id ? { ...l, ...patch } : l))
      );
      if (leadVisualizando?.id === editando.id) {
        setLeadVisualizando({ ...leadVisualizando, ...patch });
      }
      notify("Lead atualizado!");
      setEditando(null);
      setEditData({});
    } catch (err) {
      notify((err as Error).message || "Erro ao atualizar", false);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await leadsRepo.remove(deleteTarget.id);
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      if (leadVisualizando?.id === deleteTarget.id) setLeadVisualizando(null);
      notify("Lead excluído.");
      setDeleteTarget(null);
    } catch (err) {
      notify((err as Error).message || "Erro ao excluir", false);
    } finally {
      setDeleting(false);
    }
  }

  function exportarCsv() {
    if (!leadsFiltrados.length) {
      notify("Nenhum lead para exportar", false);
      return;
    }
    const headers = [
      "Nome",
      "Telefone",
      "Email",
      "Necessidade",
      "Faturamento",
      "Status",
      "Etiqueta",
      "Origem",
      "Data",
    ];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = leadsFiltrados.map((l) =>
      [
        l.nome ?? "",
        l.telefone ?? "",
        l.email ?? "",
        l.necessidade ?? "",
        fmtFaturamento(l.faturamento),
        l.status_comercial ?? "",
        l.etiqueta ?? "",
        l.origem ?? "",
        l.created_at ? new Date(l.created_at).toLocaleString("pt-BR") : "",
      ]
        .map((c) => escape(String(c)))
        .join(";")
    );
    const csv = [headers.join(";"), ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-sema-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`${leadsFiltrados.length} leads exportados.`);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroEtiqueta("todos");
    setPagina(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-azul-petroleo">Leads (CRM)</h1>
          <p className="text-sm text-muted">
            {leadsFiltrados.length} de {leads.length} registros
          </p>
        </div>
        <button className={button.secondary} onClick={exportarCsv}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Novos", value: stats.novos },
          { label: "Em contato", value: stats.emContato },
          { label: "Fechados", value: stats.fechados },
        ].map((s) => (
          <div key={s.label} className={cn(card, "flex flex-col gap-1")}>
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              {s.label}
            </span>
            <span className="text-3xl font-extrabold text-azul-petroleo">
              {loading ? "…" : s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className={cn(card, "grid grid-cols-1 gap-4 md:grid-cols-4")}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-azul-petroleo">Buscar</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <AdminInput
              placeholder="Nome, email, telefone…"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-azul-petroleo">Status</label>
          <Select
            value={filtroStatus}
            onChange={(v) => {
              setFiltroStatus(v);
              setPagina(1);
            }}
            options={STATUS_FILTER_OPTS}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-azul-petroleo">Etiqueta</label>
          <Select
            value={filtroEtiqueta}
            onChange={(v) => {
              setFiltroEtiqueta(v);
              setPagina(1);
            }}
            options={ETIQUETA_FILTER_OPTS}
          />
        </div>

        <div className="flex items-end">
          <button className={cn(button.ghost, "w-full border border-border")} onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        ) : leadsPaginados.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">
            Nenhum lead encontrado.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-azul-petroleo text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nome</th>
                <th className="px-4 py-3 text-left font-semibold">Telefone</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Necessidade</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Data</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {leadsPaginados.map((lead) => (
                <tr key={lead.id} className="hover:bg-azul-claro/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-azul-petroleo">
                    {lead.nome || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={lead.telefone ? `tel:${lead.telefone}` : undefined}
                        className="text-azul-petroleo/80 hover:text-azul-petroleo"
                      >
                        {lead.telefone || "-"}
                      </a>
                      {lead.telefone && (
                        <button
                          onClick={() => abrirWhatsApp(lead)}
                          title="Chamar no WhatsApp"
                          className="text-green-600 hover:text-green-700"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.email || "-"}</td>
                  <td
                    className="max-w-xs truncate px-4 py-3 text-azul-petroleo/80"
                    title={lead.necessidade || ""}
                  >
                    {lead.necessidade || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        statusBadgeClass(lead.status_comercial)
                      )}
                    >
                      {lead.status_comercial || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {getTimeAgo(lead.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setLeadVisualizando(lead)}
                        title="Ver detalhes"
                        className="rounded border border-azul-lavanda px-2 py-1 text-azul-lavanda hover:bg-azul-lavanda hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditando(lead);
                          setEditData({
                            status_comercial: lead.status_comercial,
                            etiqueta: lead.etiqueta,
                            segmentacao: lead.segmentacao,
                          });
                        }}
                        className="rounded border border-azul-lavanda px-3 py-1 text-xs font-medium text-azul-lavanda hover:bg-azul-lavanda hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lead)}
                        className="rounded border border-red-400 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            className={cn(button.ghost, "border border-border")}
            disabled={paginaAtual === 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span className="text-sm text-muted">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            className={cn(button.ghost, "border border-border")}
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modal detalhes */}
      {leadVisualizando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setLeadVisualizando(null)}
              className="absolute right-4 top-4 text-muted hover:text-azul-petroleo"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-azul-petroleo">Detalhes do Lead</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nome" value={leadVisualizando.nome} />
              <div>
                <p className="text-xs font-semibold text-muted">Telefone</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-azul-petroleo">
                    {leadVisualizando.telefone || "-"}
                  </p>
                  {leadVisualizando.telefone && (
                    <button
                      onClick={() => copiar(leadVisualizando.telefone || "", "Número copiado!")}
                      className="text-muted hover:text-azul-petroleo"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <Field label="Email" value={leadVisualizando.email} />
              <Field label="Faturamento" value={fmtFaturamento(leadVisualizando.faturamento)} />
              <Field label="Status comercial" value={leadVisualizando.status_comercial} />
              <Field label="Etiqueta" value={leadVisualizando.etiqueta} />
              <Field label="Origem" value={leadVisualizando.origem} />
              <Field
                label="Data"
                value={
                  leadVisualizando.created_at
                    ? new Date(leadVisualizando.created_at).toLocaleString("pt-BR")
                    : "-"
                }
              />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted">Necessidade</p>
              <div className="mt-1 whitespace-pre-wrap rounded-lg border border-border bg-branco-gelo p-3 text-sm text-azul-petroleo">
                {leadVisualizando.necessidade || "-"}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted">Segmentação / Observações</p>
              <div className="mt-1 whitespace-pre-wrap rounded-lg border border-border bg-branco-gelo p-3 text-sm text-azul-petroleo">
                {leadVisualizando.segmentacao || "-"}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className={button.secondary}
                onClick={() =>
                  copiar(
                    `Nome: ${leadVisualizando.nome || "-"}\nTelefone: ${leadVisualizando.telefone || "-"}\nEmail: ${leadVisualizando.email || "-"}\nNecessidade: ${leadVisualizando.necessidade || "-"}\nStatus: ${leadVisualizando.status_comercial || "-"}`,
                    "Dados copiados!"
                  )
                }
              >
                <Copy className="h-4 w-4" />
                Copiar dados
              </button>
              <button className={button.whatsapp} onClick={() => abrirWhatsApp(leadVisualizando)}>
                <MessageCircle className="h-4 w-4" />
                Chamar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal edição */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-azul-petroleo">Editar Lead</h2>
            <div className="mt-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-azul-petroleo">Status</label>
                <Select
                  value={editData.status_comercial ?? ""}
                  onChange={(v) =>
                    setEditData((d) => ({
                      ...d,
                      status_comercial: (v || null) as Lead["status_comercial"],
                    }))
                  }
                  options={STATUS_EDIT_OPTS}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-azul-petroleo">Etiqueta</label>
                <Select
                  value={editData.etiqueta ?? ""}
                  onChange={(v) =>
                    setEditData((d) => ({
                      ...d,
                      etiqueta: (v || null) as Lead["etiqueta"],
                    }))
                  }
                  options={ETIQUETA_EDIT_OPTS}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-azul-petroleo">
                  Segmentação / Observações
                </label>
                <textarea
                  className="min-h-[100px] resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm text-azul-petroleo outline-none focus:border-azul-lavanda"
                  value={editData.segmentacao ?? ""}
                  onChange={(e) =>
                    setEditData((d) => ({ ...d, segmentacao: e.target.value }))
                  }
                  placeholder="Adicione observações…"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className={button.secondary}
                disabled={salvando}
                onClick={() => {
                  setEditando(null);
                  setEditData({});
                }}
              >
                Cancelar
              </button>
              <button className={button.primary} disabled={salvando} onClick={salvarEdicao}>
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Excluir permanentemente o lead "${deleteTarget?.nome ?? ""}"?`}
        onConfirm={confirmarExclusao}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-[60] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg",
            toast.ok ? "bg-azul-petroleo" : "bg-red-500"
          )}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="text-sm text-azul-petroleo break-words">{value || "-"}</p>
    </div>
  );
}
