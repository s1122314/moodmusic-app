export type SimplifiedTrackObject = {
  name: string;
  artist: string;
  details?: { name: string; year: string }[]; // Updated to be an array of album details
};

export type RootStackParamList = {
  MoodScreen: undefined;
  PlayerScreen: { mood: string; song: SimplifiedTrackObject; songs: SimplifiedTrackObject[] };
};

export type TrackDetails = { name: string; year: string }[];