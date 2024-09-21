import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoodScreen from '../../components/MoodScreen';
import PlayerScreen from '../../components/PlayerScreen';


const MoodStack = createStackNavigator();

export default function MoodStackScreen() {
  return (
    <MoodStack.Navigator>
      <MoodStack.Screen name="MoodScreen" component={MoodScreen} options={{ headerShown: false }} />
      <MoodStack.Screen name="PlayerScreen" component={PlayerScreen} options={{ headerShown: false }} />
    </MoodStack.Navigator>
  );
}