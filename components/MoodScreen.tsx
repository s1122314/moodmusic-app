import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, SimplifiedTrackObject } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const AUDIO_DB_API_KEY = '2';

const moodToSongs: { [key: string]: SimplifiedTrackObject[] } = {
  'Sad': [
    { name: 'Someone Like You', artist: 'Adele' },
    { name: 'Too Good at Goodbyes', artist: 'Sam Smith' },
    { name: 'Goodbye My Lover', artist: 'James Blunt' },
    { name: 'When the Party\'s Over', artist: 'Billie Eilish' },
    { name: 'The Scientist', artist: 'Coldplay' },
    { name: 'Let Her Go', artist: 'Passenger' },
    { name: 'Someone You Loved', artist: 'Lewis Capaldi' },
    { name: 'Summertime Sadness', artist: 'Lana Del Rey' },
    { name: 'The Blower\'s Daughter', artist: 'Damien Rice' },
    { name: 'Skinny Love', artist: 'Birdy' },
  ],
  'Happy': [
    { name: 'Happy', artist: 'Pharrell Williams' },
    { name: 'Walking on Sunshine', artist: 'Katrina and the Waves' },
    { name: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake' },
    { name: 'Here Comes the Sun', artist: 'The Beatles' },
    { name: 'Firework', artist: 'Katy Perry' },
    { name: 'Don\'t Worry, Be Happy', artist: 'Bobby McFerrin' },
    { name: 'Shake It Off', artist: 'Taylor Swift' },
    { name: 'Sorry', artist: 'Justin Bieber' },
    { name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
    { name: 'Dancing Queen', artist: 'ABBA' },
  ],
  'Angry': [
    { name: 'In the End', artist: 'Linkin Park' },
    { name: 'Lose Yourself', artist: 'Eminem' },
    { name: 'Killing in the Name', artist: 'Rage Against the Machine' },
    { name: 'Enter Sandman', artist: 'Metallica' },
    { name: 'Smells Like Teen Spirit', artist: 'Nirvana' },
    { name: 'Chop Suey!', artist: 'System Of A Down' },
    { name: 'Down with the Sickness', artist: 'Disturbed' },
    { name: 'I Hate Everything About You', artist: 'Three Days Grace' },
    { name: 'The Pretender', artist: 'Foo Fighters' },
    { name: 'Freak on a Leash', artist: 'Korn' },
  ],
  'Energetic': [
    { name: 'Eye of the Tiger', artist: 'Survivor' },
    { name: 'Don\'t Stop Me Now', artist: 'Queen' },
    { name: 'Titanium', artist: 'David Guetta ft. Sia' },
    { name: 'Believer', artist: 'Imagine Dragons' },
    { name: 'Can\'t Hold Us', artist: 'Macklemore & Ryan Lewis' },
    { name: 'Stronger', artist: 'Kanye West' },
    { name: 'Pump It', artist: 'The Black Eyed Peas' },
    { name: 'Summer', artist: 'Calvin Harris' },
    { name: 'Party Rock Anthem', artist: 'LMFAO' },
    { name: 'One More Time', artist: 'Daft Punk' },
  ],
};

const moods = Object.keys(moodToSongs);

type MoodScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MoodScreen'>;

export default function MoodScreen() {
  const navigation = useNavigation<MoodScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const isSmartwatch = screenWidth < 300;
  const isTablet = screenWidth > 600;

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    const dimensionListener = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      dimensionListener?.remove();
    };
  }, []);

  const fetchTrackDetails = async (artistName: string) => {
    try {
      const response = await fetch(`https://www.theaudiodb.com/api/v1/json/${AUDIO_DB_API_KEY}/discography.php?s=${encodeURIComponent(artistName)}`);
      const data = await response.json();
      if (data.album && data.album.length > 0) {
        const albums = data.album.map((album: any) => ({
          name: album.strAlbum,
          year: album.intYearReleased,
        }));
        return albums;
      } else {
        throw new Error('Albums not found');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch albums');
    }
  };

  const selectMood = async (mood: string) => {
    setLoading(true);
    setError(null);
    const songs = moodToSongs[mood];
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    const { artist } = randomSong;

    try {
      const details = await fetchTrackDetails(artist);
      setLoading(false);
      navigation.navigate('PlayerScreen', { mood, song: { ...randomSong, details }, songs });
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };

  return (
    <View style={[styles.container, isSmartwatch && styles.smartwatchContainer]}>
      <Text style={[styles.title, isSmartwatch && styles.smartwatchTitle]}>How are you feeling today?</Text>
      {isSmartwatch ? (
        <View style={styles.smartwatchButtonRow}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[styles.smartwatchButton]}
              onPress={() => selectMood(mood)}
              disabled={loading}
            >
              <Ionicons
                name={
                  mood === 'Sad'
                    ? 'sad-outline'
                    : mood === 'Happy'
                    ? 'happy-outline'
                    : mood === 'Angry'
                    ? 'alert-circle-outline'
                    : 'flash-outline'
                }
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.buttonGrid, isTablet && styles.tabletGrid]}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[styles.button, isTablet && styles.tabletButton]}
              onPress={() => selectMood(mood)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {loading && <ActivityIndicator size="large" color="#1DB954" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  smartwatchContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  smartwatchTitle: {
    fontSize: 14,
    marginVertical: 10,
  },
  buttonGrid: {
    width: '100%',
  },
  tabletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  tabletButton: {
    width: '48%', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  smartwatchButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 14,
    width: '100%',
  },
  smartwatchButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});