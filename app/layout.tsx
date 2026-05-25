import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession, isLocalAuthBypassEnabled, signOut } from "@/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Component Selector UI",
  description: "Authenticated workspace",
};

function getUserNameParts(name?: string | null) {
  if (!name) {
    return { firstName: "Utilisateur", lastName: "" };
  }

  const [firstName = "Utilisateur", ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

function getInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0);
  const last = lastName.charAt(0);
  return `${first}${last}`.trim().toUpperCase() || "U";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const hasUserIdentity = Boolean(
    session?.user?.email || session?.user?.name || session?.user?.image,
  );

  if (!hasUserIdentity && !isLocalAuthBypassEnabled) {
    redirect("/api/auth/signin?callbackUrl=%2F");
  }

  const { firstName, lastName } = getUserNameParts(session?.user?.name);
  const initials = getInitials(firstName, lastName);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-100 text-zinc-900">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
            <p className="text-sm font-medium text-zinc-700">Component Selector</p>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Photo de profil"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border border-zinc-200 object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
                  {initials}
                </div>
              )}

              <div className="hidden sm:block">
                <p className="text-xs text-zinc-500">
                  {isLocalAuthBypassEnabled ? "Mode local" : "Connecté"}
                </p>
                <p className="text-sm font-medium text-zinc-900">
                  {firstName}
                  {lastName ? ` ${lastName}` : ""}
                </p>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirect: false });
                  redirect("/api/auth/signin?callbackUrl=%2F");
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
                >
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10">{children}</div>
      </body>
    </html>
  );
}
