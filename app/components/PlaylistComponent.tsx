export type PlaylistProps = {
  id: string;
  name: string;
  art_work_url: string;
  isActive: boolean;
  onClick: (id: string) => void;
};

export function PlaylistComponent({ id, name, art_work_url, isActive, onClick }: PlaylistProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick?.(id)}
        className={[
          "w-full rounded-2xl px-3 py-3 text-left transition",
          "flex items-center gap-3",
          isActive
            ? "bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700"
            : "hover:bg-white/70 dark:hover:bg-gray-800/70",
        ].join(" ")}
      >
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          {art_work_url ? (
            <img
              src={art_work_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
      </button>
    </li>
  )
}
