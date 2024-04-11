import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Foundation } from '@expo/vector-icons';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/SettingsScreen';

import PlayScreen from './screens/User/PlayScreen';
import Statistics from './screens/User/Statistics';

import HomeScreenAdmin from './screens/Admin/HomeScreen';
import UsersScreen from './screens/Admin/UsersScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={isSignedIn ? (isAdmin ? 'Users' : 'Play') : 'SignInTab'}
        screenOptions={({ route }) => ({
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
          },
          unmountOnBlur: true,

          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Home: 'home',
              Users: 'account-group',
              Settings: 'cog',
              Profile: 'account',
              Play: 'play',
              Statistics: 'book-information-variant',
              'Sign In': 'login',
              'Sign Up': 'account-plus',

            };
            const iconName = icons[route.name];
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {isSignedIn ? (
          isAdmin ? (
            <>
              <Tab.Screen name="Home" component={HomeScreenAdmin} />
              <Tab.Screen name="Users" component={UsersScreen} />
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen name="Statistics" component={Statistics} />
              <Tab.Screen name="Play" component={PlayScreen} />
              <Tab.Screen name="Settings">
                {(props) => <SettingsScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Tab.Screen>
            </>
          )
        ) : (
          <>
           <Tab.Screen name="Sign Up">
              {(props) => <SignUpScreen {...props} setIsSignedIn={() => setIsSignedIn(true)} setIsAdmin={() => setIsAdmin(true)} />}
            </Tab.Screen>
            <Tab.Screen name="Sign In">
              {(props) => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} setIsAdmin={setIsAdmin} />}
            </Tab.Screen>
           
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
