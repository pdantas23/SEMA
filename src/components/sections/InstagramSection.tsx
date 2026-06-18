import type { InstagramPost } from "@/lib/types";
import { SOCIAL } from "@/lib/constants";
import { InstagramEmbed } from "@/components/shared/InstagramEmbed";
import { container, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

interface InstagramSectionProps {
  posts: InstagramPost[];
}

export function InstagramSection({ posts }: InstagramSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className={cn(section, "bg-white")} aria-labelledby="instagram-heading">
      <div className={container}>
        <div className="mb-10 text-center">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-azul-petroleo hover:text-azul-lavanda transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <p className={cn(typography.eyebrow)}>{SOCIAL.instagramHandle}</p>
          </a>
          <h2 id="instagram-heading" className={cn(typography.h2, "mt-2")}>
            Acompanhe no Instagram
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Embed com altura uniforme (recortada para alinhar os cards) */}
              <div className="h-[540px] overflow-hidden">
                <InstagramEmbed url={post.url} bare />
              </div>

              {/* CTA do card (sem fade branco) */}
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 border-t border-border bg-white py-6 text-sm font-semibold text-azul-petroleo transition-colors group-hover:text-azul-lavanda"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Ver no Instagram
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
