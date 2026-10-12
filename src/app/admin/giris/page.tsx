import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { ADMIN_HOME_PATH, getAdminUser, isAdminConfigured } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Giriş" };

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect(ADMIN_HOME_PATH);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-md border border-ink/10 bg-white p-7 shadow-[0_30px_60px_-34px_rgb(26_31_37/0.45)]">
        <div className="flex justify-center rounded-sm bg-ink py-4">
          <Logo />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink">
          Yönetim Paneli
        </h1>
        <p className="mt-1 text-center text-sm text-steel-700">Yedek parça kataloğunu yönetmek için giriş yapın.</p>
        <div className="mt-6">
          <LoginForm configured={isAdminConfigured()} />
        </div>
      </div>
    </main>
  );
}
