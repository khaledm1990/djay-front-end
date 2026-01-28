import * as React from "react";
import type { Route } from "./+types/playlists";
import type { PlaylistType } from "../types/PlaylistType";
import { PlaylistTrackComponent } from "../components/PlaylistTrackComponent";
import { PlaylistComponent } from "../components/PlaylistComponent";

type PlaylistsResponse = {
  playlists: PlaylistType[];
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Playlists | djay" },
    { name: "description", content: "Browse playlists" },
  ];
}

export default function PlaylistsRoute() {

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [activeTrackId, setActiveTrackId] = React.useState<string | null>(null);
  const [activeUrl, setActiveUrl] = React.useState<string | null>(null);

  const handlePlay = React.useCallback((t: { id: string; audio_url: string }) => {
    setActiveTrackId(t.id);
    setActiveUrl(t.audio_url);
  }, []);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el || !activeUrl) return;

    el.src = activeUrl;
    el.load();
    el.play().catch(() => {
      // If the browser blocks autoplay for any reason, user can press play on controls.
    });
  }, [activeUrl]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
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
                    {playlists.map((playlist) => {
                      const is_active = playlist.id === selectedPlaylistId;
                      return (
                        <PlaylistComponent
                          {...playlist}
                          key={playlist.id}
                          is_active={is_active}
                          onClick={(id) => setSelectedPlaylistId(id)}
                        />
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
                      <p className="text-sm text-gray-500">{selected?.total_count_text}</p>
                      <span className="text-gray-300">|</span>
                      <p className="text-sm text-gray-500">{selected?.total_duration_text}</p>
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
                  selected.tracks.map((track) => (
                    <PlaylistTrackComponent {...track}
                      key={track.id}
                      is_active={track.id === activeTrackId}
                      onPlay={handlePlay}
                    />
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
