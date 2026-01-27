export type PlaylistProps = {
  id: string;
  name: string;
  art_work_url: string;
  active: boolean;
  onClick: (id: string) => void;
};

export function Playlist({ id, name, art_work_url, active, onClick }: PlaylistProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick?.(id)}
        className={[
          "w-full rounded-2xl px-3 py-3 text-left transition",
          "flex items-center gap-3",
          active
            ? "bg-white shadow-sm ring-1 ring-gray-200"
            : "hover:bg-white/70",
        ].join(" ")}
      >
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
          {art_work_url ? (
            <img
              src={art_work_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </button>
    </li>
  )
}