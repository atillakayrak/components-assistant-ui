export default function Home() {
  return (
    <main className="w-full">
      <section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Bienvenue dans Components Assistant
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Vous êtes authentifié. Utilisez le menu en haut à droite pour voir votre profil et vous déconnecter.
        </p>
      </section>
    </main>
  );
}
