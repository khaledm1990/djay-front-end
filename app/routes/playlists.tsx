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
  const [currentTrack, setCurrentTrack] = React.useState<TrackType | null>(null);
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

  React.useEffect(() => {
    if (!playlistsResponseData) return;
    setCurrentTrack((prev) => prev ?? playlistsResponseData.playlists?.[0]?.tracks?.[0] ?? null);
  }, [playlistsResponseData]);


  const onTrackClick = (track: TrackType) => {
    setCurrentTrack(track);
    setCurrentTrackId(track.id);
  };

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentTrack?.audio_url) return;

    el.load();
    const p = el.play();
    if (p?.catch) p.catch(() => { });
  }, [currentTrack?.audio_url]);

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-6 md:h-[calc(100vh-2rem)] md:min-h-0">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 h-full min-h-0">
            <div className="rounded-3xl bg-gray-50 p-6 h-full min-h-0 flex flex-col dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-orange-400" />
                <span className="text-2xl font-semibold tracking-tight">djay</span>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-700">
                  <span className="text-gray-400 dark:text-gray-500">🔎</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
                    placeholder="Search"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 flex-1 min-h-0 flex flex-col">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Playlists</h2>

                {/* Scroll container */}
                <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1 max-h-[40vh] md:max-h-none">
                  {!playlistsResponseData ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
                  ) : playlists.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No matches.</p>
                  ) : (
                    <ul className="space-y-2 mt-2 pl-1">
                      {playlists.map((playlist) => (
                        <PlaylistComponent
                          {...playlist}
                          key={playlist.id}
                          isActive={playlist.id === selectedPlaylistId}
                          onClick={(id) => setSelectedPlaylistId(id)}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9 h-full min-h-0 flex flex-col">
            {/* Keep player at top, tracks area takes remaining height */}
            <AudioPlayer
              title={currentTrack?.title}
              artist={currentTrack?.artist_name}
              artwork={currentTrack?.art_work_url}
              audioUrl={currentTrack?.audio_url}
              audioRef={audioRef as React.RefObject<HTMLAudioElement>}
            />

            <div className="h-px mb-3 mt-3 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 opacity-60 dark:from-orange-900 dark:via-pink-900 dark:to-purple-900" />


            <div className="rounded-3xl bg-white p-2 flex-1 min-h-0 flex flex-col dark:bg-gray-900">
              <div className="px-6 pt-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {selected_playlist?.name ?? "Playlists"}
                  </h1>

                  {playlistsResponseData ? (
                    <>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selected_playlist?.tracks_count_text}</p>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selected_playlist?.total_duration_text}</p>
                    </>
                  ) : null}
                </div>

                <div className="mt-6 grid grid-cols-12 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <div className="col-span-7">Title</div>
                  <div className="col-span-3">Artist</div>
                  <div className="col-span-2 text-right">Time</div>
                </div>
              </div>

              {/* Scroll container */}
              <div className="mt-3 flex-1 min-h-0 overflow-y-auto px-4 pb-6 pr-1 max-h-[50vh] md:max-h-none">
                {!selected_playlist ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">Loading…</div>
                ) : selected_playlist.tracks.length === 0 ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                    No tracks in this playlist yet.
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    {selected_playlist.tracks.map((track) => (
                      <PlaylistTrackComponent
                        key={track.id}
                        {...track}
                        isActive={track.id === currentTrackId}
                        onRowClick={() => onTrackClick(track)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
