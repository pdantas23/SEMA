import Image from "next/image";
import { TEAM_SEED } from "@/lib/constants";
import { section, card, typography } from "@/lib/design/tokens";
import { assetPath, cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface TeamCardData {
  name: string;
  role: string | null;
  bio: string | null;
  photo: string | null;
  specialties?: string[] | null;
}

function TeamCard({ member }: { member: TeamCardData }) {
  return (
    <div className={cn(card, "flex flex-col items-center text-center gap-4")}>
      {member.photo ? (
        <Image
          src={assetPath(member.photo)}
          alt={member.name}
          width={400}
          height={400}
          className="aspect-square w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-azul-petroleo/10">
          <Users size={48} className="text-azul-petroleo/40" aria-hidden="true" />
        </div>
      )}
      <div>
        <h3 className={cn(typography.h3, "text-lg")}>{member.name}</h3>
        {member.role && (
          <p className="text-sm text-azul-lavanda font-medium mt-0.5">{member.role}</p>
        )}
      </div>
      {member.bio && (
        <p className="text-sm text-azul-petroleo/70 leading-relaxed">{member.bio}</p>
      )}
      {member.specialties && member.specialties.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
          {member.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-azul-petroleo/5 px-2.5 py-0.5 text-xs text-azul-petroleo/70"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TeamSection() {
  // Seção estática — conteúdo fixo definido em TEAM_SEED, não editável no admin.
  const members: TeamCardData[] = TEAM_SEED.map((m) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    photo: m.photo,
    specialties: null,
  }));

  return (
    <section className={cn(section, "bg-branco-gelo")} aria-labelledby="equipe-heading">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className={cn(typography.eyebrow, "mb-3")}>Profissionais</p>
          <h2 id="equipe-heading" className={typography.h2}>
            Nossa Equipe
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
