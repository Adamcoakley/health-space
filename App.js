import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import screens - signed out screens
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
// signed in screens - bottom tabs
import HomeScreen from './screens/HomeScreen';
import CommentScreen from './screens/CommentScreen';
import UserScreen from './screens/UserScreen';
import ChatScreen from './screens/ChatScreen';
import CreateChatScreen from './screens/CreateChatScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import PostScreen from './screens/PostScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfile from './screens/EditProfile';
import SearchUserScreen from './screens/SearchUserScreen';
// signed in screens - sidebar / drawer
import LearnMore from './screens/LearnMore';
// icons
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
// firebase
import firebase from 'firebase/compat/app';
import { auth, db } from './config/Firebase';
// app needs to wrapped in MenuProvider to use the menu
import { MenuProvider } from 'react-native-popup-menu';
// navigation stacks 
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ProfileStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

//profile stack screen 
function ProfileStackScreen(){
  return(
  <ProfileStack.Navigator> 
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
    <ProfileStack.Screen name="Edit Profile" component={EditProfile} />
  </ProfileStack.Navigator>
  );
}

//profile stack screen 
function HomeScreenStack(){
  return(
  <HomeStack.Navigator> 
    <HomeStack.Screen name="Home Screen" component={HomeScreen} options={{ headerShown: false }}/>
    <HomeStack.Screen name="Comments" component={CommentScreen} />
    <HomeStack.Screen name="Profile" component={UserScreen} />
    <HomeStack.Screen name="Search User" component={SearchUserScreen} />
  </HomeStack.Navigator>
  );
}

//chat stack screen 
function ChatScreenStack(){
  return(
  <ChatStack.Navigator> 
    <ChatStack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}/>
    <ChatStack.Screen name="Users" component={CreateChatScreen}/>
    <ChatStack.Screen name="Messages" component={ChatRoomScreen} options={({ route }) => ({ title: route.params.name })}/>
  </ChatStack.Navigator>
  );
}

// bottom tabs 
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
      <Tab.Screen name="HomeTabs" component={HomeScreenStack} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Entypo name="home" size={28} style={{color: focused ? '#0C4BAE' : '#000', justifyContent: 'center', alignItems: 'center',}}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
      <Tab.Screen name="Chat" component={ChatScreenStack} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Entypo name="chat" size={28} style={{color: focused ? '#0C4BAE' : '#000', justifyContent: 'center', alignItems: 'center',}}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
      <Tab.Screen name="Post" component={PostScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Entypo name="plus" size={28} style={{color: '#fff', justifyContent: 'center', alignItems: 'center',}}/>
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
             <Ionicons name="notifications" size={28} style={{color: focused ? '#0C4BAE' : '#000', justifyContent: 'center', alignItems: 'center',}}/>
            </View>
          ),
          tabBarShowLabel: false,
      }}/>
     <Tab.Screen name="Profile" component={ProfileStackScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
             <Ionicons name="person" size={28} style={{color: focused ? '#0C4BAE' : '#000', justifyContent: 'center', alignItems: 'center',}}/>
            </View>
          ),
          tabBarShowLabel: false,
          headerShown: false,
      }}/>
    </Tab.Navigator>
  );
}

const SignedOutStack = () => (
      <Stack.Navigator initialRouteName='OnboardingScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
)

const SignedInStack = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeTabs} options={{headerShown:false}}/>
      <Drawer.Screen name="Learn More" component={LearnMore} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null)

    const userHandler = user =>
      user ? setCurrentUser(user) : setCurrentUser(null)

    useEffect(() => {firebase.auth().onAuthStateChanged(user => userHandler(user))},[])
    return <>{currentUser ? <SignedInStack/> : <SignedOutStack/>}</>
  }

  return (
    <NavigationContainer independent={true}>
      <MenuProvider>
        <AuthNavigation />
      </MenuProvider>
    </NavigationContainer>
  )
};