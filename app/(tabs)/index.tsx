import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ScaledSize } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Index() {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  const isSmartwatch = screenWidth < 300;
  const isTabletOrLarger = screenWidth >= 600;

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const updateDimensions = ({ window }: { window: ScaledSize }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <ScrollView
      style={{ width: '100%', height: screenHeight }}
      contentContainerStyle={[styles.container, { width: '100%', minHeight: screenHeight }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isSmartwatch && styles.smartwatchTitle]}>Welcome to MoodMusic</Text>
      </View>
      <View style={[styles.content, isTabletOrLarger && styles.tabletContent]}>
        <View style={[styles.descriptionBox, isSmartwatch && styles.smartwatchBox, isTabletOrLarger && styles.tabletBox]}>
          <Text style={[styles.subtitle, isSmartwatch && styles.smartwatchSubtitle]}>Discover Music Based on Your Mood</Text>
          <Text style={[styles.description, isSmartwatch && styles.smartwatchDescription]}>
            MoodMusic offers a unique experience where you can discover music that matches your current mood. Whether you're sad, happy, angry, or energetic, we have the perfect playlist for you.
          </Text>
        </View>
        <View style={[styles.features, isSmartwatch && styles.smartwatchBox, isTabletOrLarger && styles.tabletBox]}>
          <Text style={styles.featureTitle}>Key Features</Text>
          <Text style={styles.featureItem}>🎵 Music for every mood</Text>
          <Text style={styles.featureItem}>📈 Insights into music analysis</Text>
          <Text style={styles.featureItem}>❤️ Save your favorite songs</Text>
          <Text style={styles.featureItem}>🌐 Seamless integration with Spotify</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.button, isSmartwatch && styles.smartwatchButton, isTabletOrLarger && styles.tabletButton]}>
        <Text style={[styles.buttonText, isSmartwatch && styles.smartwatchButtonText]}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  smartwatchTitle: {
    fontSize: 18,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  tabletContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionBox: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '90%',
  },
  tabletBox: {
    width: '48%', // Geef de boxen 50% breedte
    height: 300, // Stel de hoogte van beide boxen in op 200px
    marginBottom: 0, // Verwijder de extra margin voor tablets
  },
  smartwatchBox: {
    padding: 10,
    width: '95%',
  },
  subtitle: {
    fontSize: 24,
    color: '#1DB954',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  smartwatchSubtitle: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'left',
  },
  smartwatchDescription: {
    fontSize: 12,
  },
  features: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  featureTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  featureItem: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  smartwatchButton: {
    padding: 10,
  },
  tabletButton: {
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smartwatchButtonText: {
    fontSize: 14,
  },
});