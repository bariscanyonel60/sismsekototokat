"use client";

import { useActionState } from "react";

import { loginAction, type FormState } from "@/app/admin/actions";
import { Field, inputClass, Notice } from "@/components/admin/ui";

const INITIAL: FormState = {};

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={action} className="grid gap-5">
      {!configured && (
        <Notice tone="error">
          Admin girişi henüz yapılandırılmadı. <code>npm run admin:hash</code> ile şifre üretip ortam değişkenlerine
          ekleyin.
        </Notice>
      )}
      {state.message && <Notice tone="error">{state.message}</Notice>}
      <Field label="Kullanıcı adı" htmlFor="username">
        <input id="username" name="username" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Şifre" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <button type="submit" disabled={pending || !configured} className="btn btn-primary h-12 disabled:opacity-50">
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
