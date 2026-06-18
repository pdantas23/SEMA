"use client";

/**
 * Camada de escrita (CRUD) do admin — agora via API (api.sema.adv.br).
 * O browser NÃO acessa mais o Supabase direto: tudo passa pela API, que
 * detém a service-role. As assinaturas são as mesmas de antes (as páginas
 * do admin não mudam).
 */

import { apiAuth } from "@/lib/api/client";
import type {
  Post,
  NewsItem,
  EventItem,
  Area,
  TeamMember,
  InstagramPost,
  Category,
  Lead,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// CRUD genérico (1 resource → 1 conjunto de endpoints /admin/:resource)
// ---------------------------------------------------------------------------
function baseCrud<T>(resource: string) {
  return {
    list: (): Promise<T[]> => apiAuth.get<T[]>(`/admin/${resource}`),
    getById: (id: string): Promise<T | null> =>
      apiAuth.get<T | null>(`/admin/${resource}/${id}`),
    create: (payload: Partial<T>): Promise<T> =>
      apiAuth.post<T>(`/admin/${resource}`, payload),
    update: (id: string, payload: Partial<T>): Promise<T> =>
      apiAuth.patch<T>(`/admin/${resource}/${id}`, payload),
    remove: (id: string): Promise<void> =>
      apiAuth.del<void>(`/admin/${resource}/${id}`),
  };
}

function togglePublished(resource: string) {
  return (id: string, value: boolean): Promise<void> =>
    apiAuth.patch<void>(`/admin/${resource}/${id}/toggle`, { field: "published", value });
}
function toggleFeatured(resource: string) {
  return (id: string, value: boolean): Promise<void> =>
    apiAuth.patch<void>(`/admin/${resource}/${id}/toggle`, { field: "featured", value });
}

// ---------------------------------------------------------------------------
// Upload de imagem (multipart → /admin/upload)
// ---------------------------------------------------------------------------
export async function uploadImage(
  file: File,
  folder = "uploads"
): Promise<{ path: string; url: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  return apiAuth.upload<{ path: string; url: string }>("/admin/upload", form);
}

// ---------------------------------------------------------------------------
// Repositórios
// ---------------------------------------------------------------------------
export const postsRepo = {
  ...baseCrud<Post>("posts"),
  togglePublished: togglePublished("posts"),
  toggleFeatured: toggleFeatured("posts"),
};

export const newsRepo = {
  ...baseCrud<NewsItem>("news"),
  togglePublished: togglePublished("news"),
  toggleFeatured: toggleFeatured("news"),
};

export const eventsRepo = {
  ...baseCrud<EventItem>("events"),
  togglePublished: togglePublished("events"),
  toggleFeatured: toggleFeatured("events"),
};

export const areasRepo = {
  ...baseCrud<Area>("areas"),
  togglePublished: togglePublished("areas"),
};

export const teamRepo = {
  ...baseCrud<TeamMember>("team"),
  togglePublished: togglePublished("team"),
};

export const categoriesRepo = baseCrud<Category>("categories");

export const instagramRepo = baseCrud<InstagramPost>("instagram");

// ---------------------------------------------------------------------------
// Leads (CRM)
// ---------------------------------------------------------------------------
export interface LeadsFilter {
  status?: string;
  etiqueta?: string;
}

export const leadsRepo = {
  list: (filter?: LeadsFilter): Promise<Lead[]> => {
    const sp = new URLSearchParams();
    if (filter?.status && filter.status !== "todos") sp.set("status", filter.status);
    if (filter?.etiqueta && filter.etiqueta !== "todos") sp.set("etiqueta", filter.etiqueta);
    const q = sp.toString();
    return apiAuth.get<Lead[]>(`/admin/leads${q ? `?${q}` : ""}`);
  },
  update: (id: string, payload: Partial<Lead>): Promise<Lead> =>
    apiAuth.patch<Lead>(`/admin/leads/${id}`, payload),
  remove: (id: string): Promise<void> => apiAuth.del<void>(`/admin/leads/${id}`),
};
