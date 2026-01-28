export type PlaylistTrackProps = {
  id: string;
  title: string;
  artist_name: string;
  art_work_url: string;
  duration: string;
  audio_url: string;
  is_active?: boolean;
  onPlay?: (track: { id: string; audio_url: string }) => void;
};

export function PlaylistTrackComponent({
  id,
  title,
  artist_name,
  art_work_url,
  duration,
  audio_url,
  is_active,
  onPlay,
}: PlaylistTrackProps) {
  return (
    <button
      type="button"
      onClick={() => onPlay?.({ id, audio_url })}
      className={[
        "w-full text-left grid grid-cols-12 items-center rounded-2xl px-3 py-3",
        is_active ? "bg-gray-100 ring-1 ring-gray-200" : "bg-gray-50 hover:bg-gray-100",
      ].join(" ")}
    >
      <div className="col-span-7 flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
          {art_work_url ? (
            <img src={art_work_url} alt={artist_name} className="h-full w-full object-cover" />
          ) : null}
        </div>

        <p className="min-w-0 truncate font-medium text-gray-900">{title}</p>
      </div>

      <div className="col-span-3 truncate text-sm text-gray-700">{artist_name}</div>

      <div className="col-span-2 text-right text-sm text-gray-700">{duration}</div>
    </button>
  );
}
