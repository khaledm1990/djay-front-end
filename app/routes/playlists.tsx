import * as React from "react";
import type { Route } from "./+types/playlists";

type Track = {
  id: string;
  title: string;
  artist_name: string;
  cover_url: string;   // e.g. "/images/artists/steven-cooper.jpg"
  duration: string;    // e.g. "02:17"
};

type Playlist = {
  id: string;
  name: string;
  cover_url: string;   // e.g. "/images/playlists/bass-house.jpg"
  tracks: Track[];
};

type PlaylistsResponse = {
  total_count_text: string;
  total_duration_text: string;
  playlists: Playlist[];
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Playlists | djay" },
    { name: "description", content: "Browse playlists" },
  ];
}

function joinUrl(base: string, path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function PlaylistsRoute() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

  const [data, setData] = React.useState<PlaylistsResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE}/api/v1/playlists`, { signal: ac.signal });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = (await res.json()) as PlaylistsResponse;

        setData(json);
        setSelectedPlaylistId(json.playlists?.[0]?.id ?? null);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Failed to load playlists");
      }
    })();

    return () => ac.abort();
  }, [API_BASE]);

  const playlists = React.useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.playlists;
    return data.playlists.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, query]);

  const selected =
    data?.playlists.find((p) => p.id === selectedPlaylistId) ??
    data?.playlists[0] ??
    null;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="rounded-3xl bg-gray-50 p-6">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-orange-400" />
                <span className="text-2xl font-semibold tracking-tight">djay</span>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 ring-1 ring-gray-200">
                  <span className="text-gray-400">🔎</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                    placeholder="Search"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-semibold text-gray-700">Playlists</h2>

                {!data ? (
                  <p className="mt-4 text-sm text-gray-500">Loading…</p>
                ) : playlists.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">No matches.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {playlists.map((p) => {
                      const active = p.id === selectedPlaylistId;
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedPlaylistId(p.id)}
                            className={[
                              "w-full rounded-2xl px-3 py-3 text-left transition",
                              "flex items-center gap-3",
                              active
                                ? "bg-white shadow-sm ring-1 ring-gray-200"
                                : "hover:bg-white/70",
                            ].join(" ")}
                          >
                            <div className="h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                              {p.cover_url ? (
                                <img
                                  src={joinUrl(API_BASE, p.cover_url)}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <span className="font-medium text-gray-900">{p.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="rounded-3xl bg-white p-2">
              <div className="px-6 pt-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {selected?.name ?? "Playlists"}
                  </h1>

                  {data ? (
                    <>
                      <p className="text-sm text-gray-500">{data.total_count_text}</p>
                      <span className="text-gray-300">|</span>
                      <p className="text-sm text-gray-500">{data.total_duration_text}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-6 grid grid-cols-12 px-2 text-xs font-semibold text-gray-500">
                  <div className="col-span-7">Title</div>
                  <div className="col-span-3">Artist</div>
                  <div className="col-span-2 text-right">Time</div>
                </div>
              </div>

              <div className="mt-3 space-y-2 px-4 pb-6">
                {!selected ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
                    Loading…
                  </div>
                ) : selected.tracks.length === 0 ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
                    No tracks in this playlist yet.
                  </div>
                ) : (
                  selected.tracks.map((t) => (
                    <div
                      key={t.id}
                      className="grid grid-cols-12 items-center rounded-2xl bg-gray-50 px-3 py-3"
                    >
                      <div className="col-span-7 flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                          {t.cover_url ? (
                            <img
                              src={joinUrl(API_BASE, t.cover_url)}
                              alt={t.artist_name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>

                        <p className="min-w-0 truncate font-medium text-gray-900">
                          {t.title}
                        </p>
                      </div>

                      <div className="col-span-3 truncate text-sm text-gray-700">
                        {t.artist_name}
                      </div>

                      <div className="col-span-2 text-right text-sm text-gray-700">
                        {t.duration}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
