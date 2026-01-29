import * as React from "react";
import type { Route } from "./+types/playlists";
import type { PlaylistsResponse } from "../types/PlaylistsResponse";
import { PlaylistTrackComponent } from "../components/PlaylistTrackComponent";
import { PlaylistComponent } from "../components/PlaylistComponent";
import { AudioPlayer } from "../components/AudioPlayer";
import type { TrackType } from "~/types/TrackType";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Playlists | djay" },
    { name: "description", content: "Browse playlists" },
  ];
}

export default function PlaylistsRoute() {

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = React.useState<string | null>(null);
  const [playlistsResponseData, setPlaylistsData] = React.useState<PlaylistsResponse | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");


  const [currentTrackId, setCurrentTrackId] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);


  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE}/api/v1/playlists`, { signal: ac.signal });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = (await res.json()) as PlaylistsResponse;

        setPlaylistsData(json);
        setSelectedPlaylistId(json.playlists?.[0]?.id ?? null);
        setCurrentTrackId(json.playlists[0]?.tracks[0]?.id)
        // setCurrentTrack(json.playlists[0]?.tracks[0])
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Failed to load playlists");
      }
    })();

    return () => ac.abort();
  }, [API_BASE]);

  const playlists = React.useMemo(() => {
    if (!playlistsResponseData) return [];
    const q = query.trim().toLowerCase();
    if (!q) return playlistsResponseData.playlists;
    return playlistsResponseData.playlists.filter((p) => p.name.toLowerCase().includes(q));
  }, [playlistsResponseData, query]);

  const selected_playlist =
    playlists.find((p) => p.id === selectedPlaylistId) ??
    playlists[0] ??
    null;

  const currentTrack = React.useMemo(() => {
    if (!currentTrackId) return null;
    return selected_playlist.tracks.find((t) => t.id === currentTrackId) ?? null;
  }, [currentTrackId]);


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

                {!playlistsResponseData ? (
                  <p className="mt-4 text-sm text-gray-500">Loading…</p>
                ) : playlists.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">No matches.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {playlists.map((playlist) => {
                      return (
                        <PlaylistComponent
                          {...playlist}
                          key={playlist.id}
                          isActive={playlist.id === selectedPlaylistId}
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
            {/* ✅ Player row comes first */}
            <AudioPlayer
              title={currentTrack?.title}
              artist={currentTrack?.artist_name}
              artwork={currentTrack?.art_work_url}
              audioUrl={currentTrack?.audio_url}
              audioRef={audioRef as React.RefObject<HTMLAudioElement>}
            />
            <div className="h-px bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 opacity-60" />
            <div className="rounded-3xl bg-white p-2">
              <div className="px-6 pt-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {selected_playlist?.name ?? "Playlists"}
                  </h1>

                  {playlistsResponseData ? (
                    <>
                      <p className="text-sm text-gray-500">{selected_playlist?.tracks_count_text}</p>
                      <span className="text-gray-300">|</span>
                      <p className="text-sm text-gray-500">{selected_playlist?.total_duration_text}</p>
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
                {!selected_playlist ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">Loading…</div>
                ) : selected_playlist.tracks.length === 0 ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
                    No tracks in this playlist yet.
                  </div>
                ) : (
                  <>
                    {/* Tracks */}
                    {selected_playlist.tracks.map((track) => (
                      <PlaylistTrackComponent
                        key={track.id}
                        {...track}
                        isActive={track.id === currentTrackId}
                        onRowClick={(id) => setCurrentTrackId(id)}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
