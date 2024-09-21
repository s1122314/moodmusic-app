import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlayerScreen from '../PlayerScreen';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));


global.alert = jest.fn();

const mockSongs = [
  { name: 'Song 1', artist: 'Artist 1' },
  { name: 'Song 2', artist: 'Artist 2' },
  { name: 'Song 3', artist: 'Artist 3' },
];

const route = {
  params: {
    song: mockSongs[0],
    songs: mockSongs,
    mood: 'Happy',
  },
};

describe('PlayerScreen', () => {
  it('should save song on pressing save button', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PlayerScreen route={route as any} />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Save Song'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'savedSongs',
        JSON.stringify([mockSongs[0]])
      );
      expect(global.alert).toHaveBeenCalledWith('Song saved!');
    });
  });
});