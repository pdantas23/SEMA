"use client";

import { useEffect, useState } from "react";
import { getEvents } from "@/lib/data/content";
import type { EventItem } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/** Lista de eventos buscada em runtime na API (publica na hora, sem rebuild). */
export function EventsListClient() {
  const [events, setEvents] = useState<EventItem[] | null>(null);

  useEffect(() => {
    let on = true;
    getEvents().then((r) => on && setEvents(r));
    return () => {
      on = false;
    };
  }, []);

  if (events === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-border/30" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-20 text-center">
        <span className="text-5xl font-extrabold text-azul-lavanda/20 select-none">SEMA</span>
        <p className={cn(typography.body, "mt-4")}>Nenhum evento publicado no momento.</p>
        <p className="mt-1 text-sm text-muted">Volte em breve para novos eventos e participações.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((item) => (
        <EventCard key={item.id} event={item} />
      ))}
    </div>
  );
}
