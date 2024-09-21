import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; 
import MoodScreen from '../../components/MoodScreen';
import PlayerScreen from '../../components/PlayerScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';



export default function TabLayout() {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;
  const isSmartwatch = screenWidth < 300;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,

        tabBarStyle: {
          height: isSmartwatch ? 50 : 80,
          paddingBottom: isSmartwatch ? 20 : 10,
          paddingTop: isSmartwatch ? 5 : 10,
          paddingHorizontal: isSmartwatch ? 50 : 0,  
        },
        tabBarLabelStyle: {
          display: isSmartwatch ? 'none' : 'flex', 
        },
        tabBarItemStyle: {
          marginHorizontal: isSmartwatch ? -10 : 0,  
        },
        tabBarIconStyle: {
          marginBottom: isSmartwatch ? -10 : 0,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="home"
            color={color}
            size={isSmartwatch ? 20 : 24} // Adjust icon size for smartwatches
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={isSmartwatch ? 20 : 24}/>
          ),
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'happy' : 'happy-outline'} color={color} size={isSmartwatch ? 20 : 24}/>
          ),
        }}
      />
         <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'save' : 'save-outline'} color={color} size={isSmartwatch ? 20 : 24}/>
          ),
        }}
      />
    </Tabs>
  );
}