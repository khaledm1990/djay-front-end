export type PlaylistTrackProps = {
  id: string;
  title: string;
  artist_name: string;
  art_work_url: string;
  duration: string;
  audio_url: string;

  // NEW:
  isActive?: boolean;
  onRowClick?: (trackId: string) => void;
};

export function PlaylistTrackComponent({
  id,
  title,
  artist_name,
  art_work_url,
  duration,
  onRowClick,
  isActive,
}: PlaylistTrackProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onRowClick?.(id)}
      className={[
        "w-full text-left grid grid-cols-12 items-center rounded-2xl px-3 py-3",
        "ring-1",
        isActive
          ? "bg-white ring-gray-300 shadow-sm dark:bg-gray-900 dark:ring-gray-700"
          : "bg-gray-100 ring-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:ring-gray-800 dark:hover:bg-gray-900",
      ].join(" ")}
    >
      {/* Left: play button + artwork + title */}
      <div className="col-span-7 flex items-center gap-3 min-w-0">

        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          {art_work_url ? (
            <img
              src={art_work_url}
              alt={artist_name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <p className="min-w-0 truncate font-medium text-gray-900 dark:text-gray-100">{title}</p>
      </div>

      <div className="col-span-3 truncate text-sm text-gray-700 dark:text-gray-300">{artist_name}</div>
      <div className="col-span-2 text-right text-sm text-gray-700 dark:text-gray-300">{duration}</div>
    </div>
  );
}
