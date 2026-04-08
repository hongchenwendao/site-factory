"use client";

import { useState, useTransition, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { buttonClassName } from "@site-factory/ui";
import { siteConfig } from "@site-config";

type FormState = {
  error: string | null;
  success: string | null;
};

const initialState: FormState = {
  error: null,
  success: null,
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const prefilledMessage = useMemo(() => {
    if (!productSlug) return undefined;
    return `I'm interested in learning more about ${productSlug.replace(/-/g, " ")}. Please send me a quote.`;
  }, [productSlug]);

  const cta = siteConfig.cta;
  if (cta.type !== "form") {
    return null;
  }

  return (
    <form
      className="space-y-5"
      id="contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
          setState(initialState);

          const response = await fetch("/api/contact", {
            body: JSON.stringify({
              company: formData.get("company")?.toString() || undefined,
              email: formData.get("email")?.toString() || "",
              message: formData.get("message")?.toString() || "",
              name: formData.get("name")?.toString() || "",
              phone: formData.get("phone")?.toString() || undefined,
            }),
            headers: {
              "content-type": "application/json",
            },
            method: "POST",
          });

          const payload = (await response.json()) as { error?: string; submittedAt?: string };

          if (!response.ok) {
            setState({
              error: payload.error ?? "Failed to submit your request.",
              success: null,
            });
            return;
          }

          form.reset();
          setState({
            error: null,
            success: cta.successMessage,
          });
        });
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" name="name" required type="text" />
        <Field label="Work email" name="email" required type="email" />
        <Field label="Company" name="company" type="text" />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      <Field label="What are you trying to launch?" name="message" required textarea defaultValue={prefilledMessage} />
      {state.error ? <p className="text-sm font-medium text-destructive">{state.error}</p> : null}
      {state.success ? <p className="text-sm font-medium text-primary">{state.success}</p> : null}
      <button
        className={buttonClassName({ size: "large" })}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Sending..." : cta.submitLabel}
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  required?: boolean;
  textarea?: boolean;
  type?: string;
  defaultValue?: string | undefined;
}

function Field({ label, name, required, textarea = false, type = "text", defaultValue }: FieldProps) {
  const sharedClassName =
    "mt-2 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      {textarea ? (
        <textarea className={`${sharedClassName} min-h-36 resize-y`} defaultValue={defaultValue} name={name} required={required} />
      ) : (
        <input className={sharedClassName} name={name} required={required} type={type} />
      )}
    </label>
  );
}
