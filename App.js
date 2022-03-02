import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
//import navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import screens 
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import PostScreen from './screens/PostScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
//icons
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from './config/Firebase';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
  style={{
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  }}
    onPress={onPress}
  >
  <View style={{
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#0C4BAE',
  }}>
  {children}
  </View>
  </TouchableOpacity>
);

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Entypo name="home" size={28} style={{
               color: focused ? '#0C4BAE' : '#000',
               justifyContent: 'center',
               alignItems: 'center',
               }}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
      <Tab.Screen name="Chat" component={ChatScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Entypo name="chat" size={28} style={{
               color: focused ? '#0C4BAE' : '#000',
               justifyContent: 'center',
               alignItems: 'center',
               }}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
      <Tab.Screen name="Post" component={PostScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Entypo name="plus" size={28} style={{
               color: '#fff',
               justifyContent: 'center',
               alignItems: 'center',
               }}/>
            </View>
          ),
          tabBarButton: (props) =>(
              <CustomTabBarButton {...props}/>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Ionicons name="notifications" size={28} style={{
               color: focused ? '#0C4BAE' : '#000',
               justifyContent: 'center',
               alignItems: 'center',
               }}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
     <Tab.Screen name="Profile" component={ProfileScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Ionicons name="person" size={28} style={{
               color: focused ? '#0C4BAE' : '#000',
               justifyContent: 'center',
               alignItems: 'center',
               }}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
    </Tab.Navigator>
  );
}

export default function App() {

  const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
    style={{
      top: -25,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      marginRight: 10,
    }} onPress={onPress} >
    <View style={{
      width: 50,
      height: 50,
      borderRadius: 35,
      backgroundColor: '#0C4BAE',
    }}>
    {children}
    </View>
    </TouchableOpacity>
  );

  const SignedOutStack = () => (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='OnboardingScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

  const SignedInStack = () => (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomeTabs' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )

  const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null)

    const userHandler = user =>
      user ? setCurrentUser(user) : setCurrentUser(null)

    useEffect(() => {firebase.auth().onAuthStateChanged(user => userHandler(user))},[])
    return <>{currentUser ? <SignedInStack/> : <SignedOutStack/>}</>
  }

  return (
      <AuthNavigation />
  );
};