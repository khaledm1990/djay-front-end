type PlayerRowProps = {
  title?: string;
  artist?: string;
  artwork?: string;
  audioUrl?: string;
  audioRef: React.RefObject<HTMLAudioElement>;
};

export function AudioPlayer({ title, artist, artwork, audioUrl, audioRef }: PlayerRowProps) {
  return (
    <div
      className="
          rounded-3xl
          bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50
          dark:from-orange-950 dark:via-pink-950 dark:to-purple-950
          ring-1 ring-orange-200 dark:ring-orange-900/60
          px-5 py-4
          shadow-sm
          transition
          hover:shadow-md
        "
    >
      <div className="grid grid-cols-12 items-center gap-3">
        <div className="col-span-7 flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
            {artwork ? (
              <img src={artwork} alt={title ?? "Now playing"} className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="truncate font-medium text-gray-900 dark:text-gray-100">
              {title ?? "Pick a track to play"}
            </div>
            <div className="truncate text-sm text-gray-600 dark:text-gray-300">
              {artist ?? " "}
            </div>
          </div>
        </div>

        <div className="col-span-5">
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
