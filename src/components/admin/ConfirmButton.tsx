"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

/** Silme gibi geri alınamayan işlemler için onay isteyen gönder butonu. */
export function ConfirmButton({
  message,
  className,
  children,
  label,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label={label}
      disabled={pending}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

export function SubmitButton({ children, className }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Kaydediliyor…" : children}
    </button>
  );
}
