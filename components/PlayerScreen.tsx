import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import { RootStackParamList, SimplifiedTrackObject } from '../types/navigation';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'PlayerScreen'>;

interface PlayerScreenProps {
  route: PlayerScreenRouteProp;
}

const AUDIO_DB_API_KEY = '2';

export default function PlayerScreen({ route }: PlayerScreenProps) {
  const navigation = useNavigation();
  const { song, songs, mood } = route.params;

  const [currentSong, setCurrentSong] = useState<SimplifiedTrackObject>(song);
  const [currentIndex, setCurrentIndex] = useState(songs.indexOf(song));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlbums, setShowAlbums] = useState(false);
  const fetchInProgress = useRef(false);

  const THRESHOLD = 1.78; 
  const SHAKE_DELAY = 1000; 
  const TRANSITION_DELAY = 500; 
  let lastShakeTime = 0;

  const screenWidth = Dimensions.get('window').width;
  const isSmartwatch = screenWidth < 300;

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
        return [];
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch albums');
    }
  };

  const loadTrackDetails = async (song: SimplifiedTrackObject) => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;
    setLoading(true);
    setError(null);
    try {
      const details = await fetchTrackDetails(song.artist);
      setCurrentSong({ ...song, details });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    loadTrackDetails(currentSong);
  }, [currentSong]);

  const handlePlay = () => {
    const url = `https://open.spotify.com/search/${encodeURIComponent(currentSong.name)}%20${encodeURIComponent(currentSong.artist)}`;
    Linking.openURL(url);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
      return nextIndex;
    });
  };
  
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(songs[prevIndex]);
  };

  const renderAlbum = ({ item }: { item: { name: string; year: string } }) => (
    <View style={styles.albumContainer}>
      <Text style={styles.albumName}>{item.name}</Text>
      <Text style={styles.albumYear}>{item.year}</Text>
    </View>
  );

  const handleSave = async () => {
    try {
      const savedSongsJson = await AsyncStorage.getItem('savedSongs');
      const savedSongs = savedSongsJson ? JSON.parse(savedSongsJson) : [];
      const updatedSavedSongs = [...savedSongs, currentSong];
      await AsyncStorage.setItem('savedSongs', JSON.stringify(updatedSavedSongs));
      alert('Song saved!');
    } catch (error) {
      console.error('Failed to save song', error);
    }
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); 

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();
      if (totalForce > THRESHOLD && (now - lastShakeTime > SHAKE_DELAY)) {
        lastShakeTime = now;
        setTimeout(handleNext, TRANSITION_DELAY); 
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, isSmartwatch && styles.smartwatchContainer]}>
      <TouchableOpacity style={[styles.backButton, isSmartwatch && styles.smartwatchBackButton]} onPress={handleBack}>
        <FontAwesome name="arrow-left" size={isSmartwatch ? 24 : 32} color="white" />
      </TouchableOpacity>
      <View style={[styles.headerContainer, isSmartwatch && styles.smartwatchHeaderContainer]}>
        <Text style={[styles.title, isSmartwatch && styles.smartwatchTitle]}>{currentSong.name}</Text>
        <Text style={[styles.subtitle, isSmartwatch && styles.smartwatchSubtitle]}>{currentSong.artist}</Text>
      </View>
      <View style={[styles.controlsContainer, isSmartwatch && styles.smartwatchControlsContainer]}>
        <View style={[styles.controls, isSmartwatch && styles.smartwatchControls]}>
          <TouchableOpacity onPress={handlePrev}>
            <FontAwesome name="backward" size={isSmartwatch ? 24 : 32} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlay}>
            <FontAwesome name="play" size={isSmartwatch ? 24 : 32} color="#1DB954" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <FontAwesome name="forward" size={isSmartwatch ? 24 : 32} color="#1DB954" />
          </TouchableOpacity>
        </View>
        {!isSmartwatch && (
          <TouchableOpacity
            style={styles.albumButton}
            onPress={() => setShowAlbums(!showAlbums)}
          >
            <Text style={styles.albumButtonText}>{showAlbums ? 'Hide Albums' : 'Show Albums'}</Text>
          </TouchableOpacity>
        )}
        {!isSmartwatch && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Song</Text>
          </TouchableOpacity>
        )}
        {isSmartwatch && (
          <TouchableOpacity
            style={[styles.saveButton, styles.smartwatchSaveButton]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, styles.smartwatchSaveButtonText]}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
      {showAlbums && !isSmartwatch && (
        <View style={styles.albumListContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" />
          ) : (
            <FlatList
              data={currentSong.details}
              renderItem={renderAlbum}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              contentContainerStyle={styles.albumList}
              ListEmptyComponent={<Text style={styles.noAlbums}>No albums available</Text>}
            />
          )}
        </View>
      )}
      {error && <Text style={[styles.error, isSmartwatch && styles.smartwatchError]}>{error}</Text>}
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
  backButton: {
    position: 'absolute',
    top: 80,
    left: 30,
  },
  smartwatchBackButton: {
    top: 20,
    left: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  smartwatchHeaderContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    paddingTop: 100, 
  },
  smartwatchTitle: {
    fontSize: 16,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
  smartwatchSubtitle: {
    fontSize: 14,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  smartwatchControlsContainer: {
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 240, 
  },
  smartwatchControls: {
    width: 180,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 30,
  },
  albumButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  smartwatchSaveButton: {
    marginTop: 16,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  smartwatchSaveButtonText: {
    fontSize: 14,
  },
  albumListContainer: {
    flex: 1,
    width: '100%',
  },
  albumList: {
    paddingBottom: 20,
  },
  albumContainer: {
    marginBottom: 10,
    padding: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  albumName: {
    fontSize: 16,
    color: '#fff',
  },
  albumYear: {
    fontSize: 14,
    color: '#aaa',
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
  smartwatchError: {
    fontSize: 12,
    marginTop: 10,
  },
  noAlbums: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});