"use client";

import { useMemo, useState } from "react";

type Category = "all" | "layout" | "input" | "feedback";

type UiComponent = {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  description: string;
};

const components: UiComponent[] = [
  {
    id: "card",
    name: "Card",
    category: "layout",
    description: "Container simple avec titre, contenu et footer.",
  },
  {
    id: "stack",
    name: "Stack",
    category: "layout",
    description: "Disposition verticale avec espacement automatique.",
  },
  {
    id: "text-input",
    name: "Text Input",
    category: "input",
    description: "Champ texte avec label et message d'erreur.",
  },
  {
    id: "select",
    name: "Select",
    category: "input",
    description: "Liste deroulante avec recherche optionnelle.",
  },
  {
    id: "toast",
    name: "Toast",
    category: "feedback",
    description: "Notification temporaire en haut de page.",
  },
  {
    id: "alert",
    name: "Alert",
    category: "feedback",
    description: "Message de statut succes, info ou erreur.",
  },
];

const categoryLabels: Record<Category, string> = {
  all: "Tous",
  layout: "Layout",
  input: "Input",
  feedback: "Feedback",
};

export default function LocalWorkspace() {
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");

  const filteredComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return components.filter((component) => {
      const matchesCategory =
        category === "all" || component.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        component.name.toLowerCase().includes(normalizedQuery) ||
        component.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section className="w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Component Selector</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Mode local actif: explore et filtre tes composants sans auth Google.
          </p>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un composant"
          className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-500 sm:w-64"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(categoryLabels) as Category[]).map((value) => {
          const active = value === category;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {categoryLabels[value]}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredComponents.map((component) => (
          <article
            key={component.id}
            className="rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-zinc-900">{component.name}</h3>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {categoryLabels[component.category]}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{component.description}</p>
          </article>
        ))}
      </div>

      {filteredComponents.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">Aucun composant ne correspond a ta recherche.</p>
      ) : null}
    </section>
  );
}
