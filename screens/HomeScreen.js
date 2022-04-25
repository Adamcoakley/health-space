import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { RefreshControl, StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
//i cons
import { Fontisto } from '@expo/vector-icons'; 
import { Divider } from 'react-native-elements';
import Stories from '../components/Stories';
import Post from '../components/Post';
// notifications 
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
// firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // function to get all posts
  const getPosts = async() => {
    db.collection('posts').orderBy('created_at', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => doc.data()));
    });
  }

  // on page load
  useEffect(() => {
    // fetch all posts
    getPosts();
    // check if the user has notifications enabled
    registerForPushNotificationsAsync();
  }, []);

  // function to handle sign out
  const handleSignout = () => {
    try {
      firebase.auth().signOut()
      console.log('Signed out successfully')
    } catch (error) {
      console.log(error)
    }
  }

  // as the home screen is the first screen after login, we can register the user for notifications
  async function registerForPushNotificationsAsync() {
    // token is undefined initially
    let token; 
    // check to see if the user has granted permission to notifications
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      // permissions granted, get the token
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    // store the token in firebase
    if(token){
      const result = await db.collection('users').doc(firebase.auth().currentUser.uid).update({
        token: token
      });
    }
   
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  // timeout function used when refreshing the page
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  // refresh the page function
  const onRefresh = () => {
    setRefreshing(true);
    getPosts();
    wait(1500).then(() => setRefreshing(false));
  }
    
  return (  
    <SafeAreaView style={styles.container}>
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleSignout}>
        <Image 
        style={styles.logo}
        source={require('../assets/logo.png')} 
        />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Search User')}>
            <Fontisto 
            name="search" 
            size={22} 
            style={styles.icon}/>
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
    <Stories />
    <Divider width={8} style={{paddingTop: 5}}/>
    {posts.map((post, index) => (
      <Post post={post} key={index} />
    ))}
    </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: '#FFF',
    },
    headerContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    iconContainer:{
        marginRight: 10,
    },
    icon:{
        width: 30,
        height: 30,
    },
    logo:{
        width: 150,
        height: 50,
        resizeMode: 'contain',
    }
});