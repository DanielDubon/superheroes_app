import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Teams from '../screens/Teams';
import Favorites from '../screens/Favorites';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';


import Fist from '../../assets/fist/fist.svg';
import Heart from '../../assets/medium-heart/medium-heart.svg';
import FilledHeart from '../../assets/medium-filled-heart/medium-filled-heart.svg';
import Logo from '../../assets/logo/logo.svg';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
     
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.heartplaceholder,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 0.8,
          height: 68,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          switch (route.name) {
            case 'Superheroes':
              return <Fist width={22} height={22} fill={color} />;
            case 'Teams':
              return <Logo width={22} height={22} />;
            case 'Favorites':
            
              return <Heart width={22} height={22} />;
          }
        },
      })}
    >
      <Tab.Screen name="Superheroes" component={Home} />
      <Tab.Screen name="Teams" component={Teams} />
      <Tab.Screen name="Favorites" component={Favorites} />
    </Tab.Navigator>
  );
}
