import SpotifyWebApi from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const spotifyApi = new SpotifyWebApi();

const keys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];

export async function fetchTrackInfo(uri: string) {
  const token = await AsyncStorage.getItem('spotify_access_token');
  if (token) {
    spotifyApi.setAccessToken(token);
    const trackId = uri.split(':').pop();
    const trackData = await spotifyApi.getTrack(trackId);
    const audioFeatures = await spotifyApi.getAudioFeaturesForTrack(trackId);

    return {
      bpm: audioFeatures.tempo,
      year: new Date(trackData.album.release_date).getFullYear(),
      key: keys[audioFeatures.key] || 'Unknown',
      background: trackData.album.name, // Use album name as a placeholder for background info
    };
  } else {
    throw new Error('No token available');
  }
}