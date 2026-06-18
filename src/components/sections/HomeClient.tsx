"use client";

import { useEffect, useState } from "react";
import {
  getFeaturedPosts,
  getNews,
  getEvents,
  getInstagramPosts,
} from "@/lib/data/content";
import type { Post, NewsItem, EventItem, InstagramPost } from "@/lib/types";
import { HeroSection, type HeroSlide } from "@/components/sections/HeroSection";
import { OfficeSection } from "@/components/sections/OfficeSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { FeaturedPostsSection } from "@/components/sections/FeaturedPostsSection";
import { NewsEventsSection } from "@/components/sections/NewsEventsSection";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { ContactCtaSection } from "@/components/sections/ContactCtaSection";

/**
 * Home com dados em runtime (busca na API). As seções institucionais
 * (Office/Team/Contact) são estáticas; as demais refletem o conteúdo publicado
 * na hora, sem rebuild.
 */
export function HomeClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    let on = true;
    Promise.all([
      getFeaturedPosts(3),
      getNews(3),
      getEvents(3),
      getInstagramPosts(3),
    ]).then(([p, n, e, ig]) => {
      if (!on) return;
      setPosts(p);
      setNews(n);
      setEvents(e);
      setInstagramPosts(ig);
    });
    return () => {
      on = false;
    };
  }, []);

  // Carrossel da hero: destaque mais recente de cada tipo.
  const heroSlides: HeroSlide[] = [
    posts[0] && {
      eyebrow: "Artigo em destaque",
      title: posts[0].title,
      image: posts[0].cover_image,
      href: `/blog/${posts[0].slug}`,
      cta: "Ler artigo",
    },
    news[0] && {
      eyebrow: "Notícia",
      title: news[0].title,
      image: news[0].cover_image,
      href: `/noticias/${news[0].slug}`,
      cta: "Ler notícia",
    },
    events[0] && {
      eyebrow: "Evento",
      title: events[0].name,
      image: events[0].cover_image,
      href: `/eventos/${events[0].slug}`,
      cta: "Ver evento",
    },
  ].filter((s): s is HeroSlide => Boolean(s));

  return (
    <>
      <HeroSection slides={heroSlides} />
      <OfficeSection />
      <TeamSection />
      <FeaturedPostsSection posts={posts} />
      <NewsEventsSection news={news} events={events} />
      <InstagramSection posts={instagramPosts} />
      <ContactCtaSection />
    </>
  );
}
