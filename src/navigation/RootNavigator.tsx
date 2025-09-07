import React from 'react';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tabs from './Tabs';
import HeroDetail from '../screens/HeroDetail';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Tabs: undefined;
  HeroDetail: { hero: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.heartplaceholder,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: 'transparent',
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="HeroDetail" component={HeroDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
