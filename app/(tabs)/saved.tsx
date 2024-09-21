import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SimplifiedTrackObject } from '../../types/navigation';
import * as Linking from 'expo-linking';

export default function SavedSongsScreen() {
  const [savedSongs, setSavedSongs] = useState<SimplifiedTrackObject[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const isSmartwatch = screenWidth < 300;

  useEffect(() => {
    const fetchSavedSongs = async () => {
      try {
        const savedSongsJson = await AsyncStorage.getItem('savedSongs');
        if (savedSongsJson) {
          setSavedSongs(JSON.parse(savedSongsJson));
        }
      } catch (error) {
        console.error('Failed to fetch saved songs', error);
      }
    };

    fetchSavedSongs();
  }, []);

  const handleDelete = async (song: SimplifiedTrackObject) => {
    const updatedSavedSongs = savedSongs.filter(
      (savedSong) => savedSong.name !== song.name || savedSong.artist !== song.artist
    );
    setSavedSongs(updatedSavedSongs);
    await AsyncStorage.setItem('savedSongs', JSON.stringify(updatedSavedSongs));
  };

  const confirmDelete = (song: SimplifiedTrackObject) => {
    Alert.alert(
      'Delete Song',
      'Are you sure you want to delete this song from your saved list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(song),
        },
      ]
    );
  };

  const renderSong = ({ item }: { item: SimplifiedTrackObject }) => (
    <View style={[styles.songContainer, isSmartwatch && styles.smartwatchSongContainer]}>
      <View style={styles.songInfo}>
        <Text style={[styles.songName, isSmartwatch && styles.smartwatchSongName]}>{item.name}</Text>
        <Text style={[styles.songArtist, isSmartwatch && styles.smartwatchSongArtist]}>{item.artist}</Text>
      </View>
      <View style={styles.songActions}>
        <TouchableOpacity
          style={[styles.playButton, isSmartwatch && styles.smartwatchPlayButton]}
          onPress={() => {
            const url = `https://open.spotify.com/search/${encodeURIComponent(item.name)}%20${encodeURIComponent(item.artist)}`;
            Linking.openURL(url);
          }}
        >
          <Text style={[styles.playButtonText, isSmartwatch && styles.smartwatchPlayButtonText]}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, isSmartwatch && styles.smartwatchDeleteButton]}
          onPress={() => confirmDelete(item)}
        >
          <Text style={[styles.deleteButtonText, isSmartwatch && styles.smartwatchDeleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isSmartwatch && styles.smartwatchContainer]}>
      <Text style={[styles.title, isSmartwatch && styles.smartwatchTitle]}>Saved Songs</Text>
      <FlatList
        data={savedSongs}
        renderItem={renderSong}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={[styles.songList, isSmartwatch && styles.smartwatchSongList]}
        ListEmptyComponent={<Text style={[styles.noSongs, isSmartwatch && styles.smartwatchNoSongs]}>No saved songs</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  smartwatchContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    paddingTop: 50,
  },
  smartwatchTitle: {
    fontSize: 18,
    marginBottom: 10,
    paddingTop: 20,
  },
  songList: {
    paddingBottom: 20,
  },
  smartwatchSongList: {
    paddingBottom: 10,
  },
  songContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
  smartwatchSongContainer: {
    padding: 5,
    marginBottom: 5,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    color: '#fff',
  },
  smartwatchSongName: {
    fontSize: 14,
  },
  songArtist: {
    fontSize: 14,
    color: '#ccc',
  },
  smartwatchSongArtist: {
    fontSize: 12,
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  smartwatchPlayButton: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  smartwatchPlayButtonText: {
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  smartwatchDeleteButton: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  smartwatchDeleteButtonText: {
    fontSize: 12,
  },
  noSongs: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  smartwatchNoSongs: {
    fontSize: 14,
    marginTop: 10,
  },
});