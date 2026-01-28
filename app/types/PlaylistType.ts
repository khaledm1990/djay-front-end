import type { TrackType } from "./TrackType";

export type PlaylistType = {
  id: string;
  name: string;
  art_work_url: string;
  tracks_count_text: string;
  total_duration_text: string;
  tracks: TrackType[];
};  