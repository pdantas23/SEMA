"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { submitContact } from "@/lib/data/content";
import { button } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { Select, type SelectOption } from "@/components/shared/Select";
import { gtmPush } from "@/lib/gtm";

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  whatsapp: z
    .string()
    .refine(
      (v) => {
        const d = v.replace(/\D/g, "").length;
        return d >= 10 && d <= 11;
      },
      "Informe um número válido com DDD."
    ),
  assunto: z.string().min(3, "Informe o assunto da mensagem."),
  mensagem: z.string().min(10, "A mensagem deve ter ao menos 10 caracteres."),
});

type FormData = z.infer<typeof schema>;

const ASSUNTOS = [
  "Direito Tributário",
  "Direito Societário e Empresarial",
  "Direito Ambiental",
  "Direito Imobiliário e Fundiário",
  "Agronegócio",
  "Consultivo Jurídico",
  "Outro",
] as const;

const ASSUNTO_OPTIONS: SelectOption[] = ASSUNTOS.map((a) => ({
  value: a,
  label: a,
}));

const fieldClass =
  "mt-1.5 w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-azul-petroleo placeholder-azul-petroleo/30 outline-none ring-0 transition focus:border-azul-lavanda focus:ring-2 focus:ring-azul-lavanda/20 disabled:opacity-50";

const labelClass = "block text-sm font-semibold text-azul-petroleo";
const errorClass = "mt-1 text-xs text-red-600";

/** Formata um telefone BR enquanto o usuário digita: (DD) 9XXXX-XXXX. */
function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { assunto: "" } });

  const whatsappReg = register("whatsapp");

  const onSubmit = async (data: FormData) => {
    setStatus("idle");
    gtmPush("form_submit_attempt", { form_name: "contato" });
    const result = await submitContact(data);
    if (result.ok) {
      setStatus("success");
      reset();
      gtmPush("form_submit_success", { form_name: "contato", assunto: data.assunto });
    } else {
      setStatus("error");
      setServerError(result.error ?? "Erro ao enviar. Tente novamente.");
      gtmPush("form_submit_error", { form_name: "contato", error: result.error });
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white p-10 text-center">
        <CheckCircle size={40} className="text-green-600" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-bold text-azul-petroleo">Mensagem enviada!</h3>
          <p className="mt-2 text-sm text-azul-petroleo/70">
            Recebemos sua solicitação e entraremos em contato em breve.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={cn(button.ghost, "text-xs")}
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-border bg-white p-7 space-y-5"
    >
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label htmlFor="nome" className={labelClass}>
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nome"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            {...register("nome")}
            className={fieldClass}
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? "nome-error" : undefined}
          />
          {errors.nome && (
            <p id="nome-error" className={errorClass} role="alert">
              {errors.nome.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            {...register("email")}
            className={fieldClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className={errorClass} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(86) 98320-0244"
            maxLength={16}
            {...whatsappReg}
            onChange={(e) => {
              e.target.value = formatPhone(e.target.value);
              whatsappReg.onChange(e);
            }}
            className={fieldClass}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
          />
          {errors.whatsapp && (
            <p id="whatsapp-error" className={errorClass} role="alert">
              {errors.whatsapp.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="assunto" className={labelClass}>
            Assunto <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="assunto"
            render={({ field }) => (
              <Select
                id="assunto"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={ASSUNTO_OPTIONS}
                placeholder="Selecione uma área"
                invalid={!!errors.assunto}
                describedBy={errors.assunto ? "assunto-error" : undefined}
                className="mt-1.5"
              />
            )}
          />
          {errors.assunto && (
            <p id="assunto-error" className={errorClass} role="alert">
              {errors.assunto.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className={labelClass}>
          Mensagem <span className="text-red-500">*</span>
        </label>
        <textarea
          id="mensagem"
          rows={5}
          placeholder="Descreva brevemente sua demanda jurídica..."
          {...register("mensagem")}
          className={cn(fieldClass, "resize-y")}
          aria-invalid={!!errors.mensagem}
          aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
        />
        {errors.mensagem && (
          <p id="mensagem-error" className={errorClass} role="alert">
            {errors.mensagem.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(button.primary, "w-full sm:w-auto")}
      >
        {isSubmitting ? "Enviando…" : (
          <>
            Enviar mensagem
            <Send size={15} aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-xs text-muted">
        Seus dados são tratados com sigilo profissional e em conformidade com a LGPD.
      </p>
    </form>
  );
}
