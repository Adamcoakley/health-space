import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
//components 
import { Divider } from 'react-native-elements';
import Stories from '../components/Stories';
import Post from '../components/Post';
import {windowHeight, windowWidth} from '../utils/Dimensions';
// icons
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const UserScreen = ({ route, navigation }) => { {
    // route params
    const {profile_picture, name, user_id} = route.params;  
    // state variables
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState(false);
    const [followingText, setFollowingText] = useState('Follow');
    const [followingCount, setFollowingCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [bio, setBio] = useState();
    const [condition, setCondition] = useState();

    // get user information that matches the ID passed in from the route
    const getUser = async () => {
      const user = await db.collection('users').doc(user_id).get();
      setUser(user.data());
      setBio(user.data().bio);
      setCondition(user.data().condition);
    }

    // get the current user's information
    const getCurrentUser = async () => {
      const currentUser = await db.collection('users').doc(firebase.auth().currentUser.uid).get();
      setCurrentUser(currentUser.data());
    }

    // send a push notification when the user receives a new follwer
    const sendPushNotification = async (token) => {
      const message = {
        to: token,
        sound: 'default',
        title: 'HealthSpace',
        body: currentUser.name + ' started following you!',
        data: { someData: 'goes here' },
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }

    // get posts that match the user's ID passed in from the route
    // order the posts by the date they were created
    const getPosts = async () => {
      const posts = await db.collection('posts').where('user_id', '==', user_id).orderBy('created_at', 'desc').get();
      setPosts(posts.docs.map(doc => doc.data()));
      console.log(posts.docs.map(doc => doc.data()));
    }

    // check if the current user is following the user profile you clicked on
    const checkFollowing = async() => {
      db.collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(user_id)
      .get()
      .then((documentSnapshot) => {
        if(documentSnapshot.exists ) {
          setFollowing(true);
          setFollowingText('Following');
        } else{
          setFollowing(false);
          setFollowingText('Follow');
        }
      })
    }

    // handle the follow button being pressed
    const handleFollowBtn = async() => {
      // check if following 
      if(following) {
        // unfollow the user from the following collection
        db.collection('following')
        .doc(firebase.auth().currentUser.uid)
        .collection('userFollowing')
        .doc(user_id)
        .delete()
        .then(() => {
          setFollowing(false);
          setFollowingText('Follow');
        })

        // remove the current user from the user's follower collection
        db.collection('followers')
        .doc(user_id)
        .collection('userFollowers')
        .doc(firebase.auth().currentUser.uid)
        .delete()

        // remove the last notification from the user's notification collection
        db.collection('notifications')
        .doc(user_id)
        .collection('userNotifications')
        .doc(firebase.auth().currentUser.uid)
        .delete()

      } else {
        // follow the user
        db.collection('following')
        .doc(firebase.auth().currentUser.uid)
        .collection('userFollowing')
        .doc(user_id)
        .set({})
        .then(() => {
          setFollowing(true);
          setFollowingText('Following');
        })

        // add the current user to the user's follower collection
        db.collection('followers')
        .doc(user_id)
        .collection('userFollowers')
        .doc(firebase.auth().currentUser.uid)
        .set({})

        // send a push notification if the user has a token
        if(user.token) {
          sendPushNotification(user.token);
        }

        // notify the user that they have a new follower
        // including the document id so that the notification can be deleted later if needed
        const newDocRef = db.collection('notifications').doc(user_id).collection('allNotifications').doc();
        newDocRef.set({
          // need the current user's profile picture, name and text for the notification
          // and the time of the notification
          profile_picture: currentUser.profile_picture,
          name: currentUser.name,
          text: 'Started following you',
          time: firebase.firestore.FieldValue.serverTimestamp(),
          id: newDocRef.id
        })
    }
    // finally, update the follower count
    getFollowerCount();
  }

  // check how many people the user is following
  const getFollowingCount = async() => {
    db.collection('following')
    .doc(user_id)
    .collection('userFollowing')
    .get()
    .then((querySnapshot) => {
      setFollowingCount(querySnapshot.size);
    })
  }

  // check how many followers the user has
  const getFollowerCount = async() => {
    db.collection('followers')
    .doc(user_id)
    .collection('userFollowers')
    .get()
    .then((querySnapshot) => {
      setFollowerCount(querySnapshot.size);
    })
  }

  // check if the user has a bio and / or condition set
  // if they do, render a component with the bio and condition
  const aboutMeComponent = () => {
    if(bio && condition) {
      return (
        <View style={styles.aboutMeContainer}>
          <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 10,}}>About Me</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="book" size={20} color="black" />
          <Text style={styles.aboutMeText}>{bio}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <FontAwesome5 name="heartbeat" size={20} color="black" />
          <Text style={styles.aboutMeText}>{condition}</Text>
        </View>
      </View>
      )
    }

    // if the user has a bio but not a condition, render a component with the bio
    else if(bio) {
      return (
        <View>
          <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 10,}}>About Me</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="book" size={20} color="black" />
          <Text style={styles.aboutMeText}>{bio}</Text>
        </View>
      </View>
      )
    }

    // if the user has a condition but not a bio, render a component with the condition
    else if(condition) {
      return (
        <View>
          <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 10,}}>About Me</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome5 name="heartbeat" size={20} color="black" />
          <Text style={styles.aboutMeText}>{condition}</Text>
        </View>
      </View>
      )
    }
  }

  // on page load call all the above functions
  // 1. get the current user's information
  // 2. get the selected user's information
  // 3. check if the current user is following the selected user
  // 4. check the selected user's following count
  // 5. check the selected user's follower count
  // 6. get the current user's information
  useEffect(async() => {
    await getUser();
    await getPosts();
    await checkFollowing();
    await getFollowingCount();
    await getFollowerCount();
    await getCurrentUser();
  }, [])
    
  return (
      <ScrollView style={styles.container}>
      <View style={styles.content_container}>
      <View style={{alignItems: 'center'}}>
          <Image source={{uri: profile_picture}}  style={styles.userImg} />
      </View>
      <View style={{alignItems: 'center'}}>
          <Text style={styles.username}>{name}</Text>
      </View>
      </View>
      <View style={styles.counters_container}>
          <View style={{justifyContent: 'center'}}>
              <Text style={styles.title}>{posts.length}</Text>
              <Text style={styles.subtitle}>Posts</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
              <Text style={styles.title}>{followerCount}</Text>
              <Text style={styles.subtitle}>Followers</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
              <Text style={styles.title}>{followingCount}</Text>
              <Text style={styles.subtitle}>Following</Text>
          </View>
          </View>
          <View style={{justifyContent: 'center',}}>
          <TouchableOpacity style={styles.followBtn} onPress={handleFollowBtn}>
            <Text style={styles.buttonText}>{followingText}</Text>
          </TouchableOpacity>
          </View>
          <View style={{marginLeft: 20, marginTop: 0}}>
          <View style={styles.aboutMe}>
            {aboutMeComponent()}
          </View>
          </View>
          {posts.map((post, index) => (
          <Post post={post} key={index} />
          ))}
      </ScrollView>
      );
  }};
    
export default UserScreen;
    
const styles = StyleSheet.create({
      container:{
        flex: 1,
        backgroundColor: '#FFF',
      },  
      content_container:{
        alignItems: 'center',
      },
      userImg: {
        height: 125,
        width: 125,
        borderRadius: 75,
        marginTop: 15,
      },
      counters_container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 15,
      },
      username: {
        marginTop: 15,
        fontSize: 20,
      },
      followBtn:{
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        borderRadius: 3,
        backgroundColor: '#FFF',
        height: windowHeight / 20,
        borderColor: 'grey',
        borderWidth: 1,
      }, 
      buttonText:{
        fontSize: 14,
        color: '#000',
        fontFamily: 'Verdana',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
      },
      aboutMeContainer: {
        flexDirection: 'column',
      },
      aboutMeText:{
        fontSize: 14,
        marginLeft: 10,
      },
    });