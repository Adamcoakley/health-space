import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { RefreshControl, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { CONDITIONS } from '../data/conditions';
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

const ProfileScreen = ({ navigation }) => { {
  // state variables 
  const [text, setText] = useState(null)
  const [profilePicture, setProfilePicture] = useState(); 
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState();
  const [condition, setCondition] = useState();
  const [similarUsers, setSimilarUsers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // get the current user's information
  const getUser = async() => {
    db.collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if(documentSnapshot.exists ) {
        setBio(documentSnapshot.data().bio);
        setText(documentSnapshot.data().name);
        setCondition(documentSnapshot.data().condition);
        console.log('condition: ', condition);
        setProfilePicture(documentSnapshot.data().profile_picture);
        console.log('User Data', documentSnapshot.data());
      } else{
        console.log('User not found');
      }
    })
  }

  // get similar users where the user's condition is similar to the current user's condition
  const getSimilarUsers = async() => {
    db.collection('users')
    .where('condition', '==', condition)
    .get()
    .then((snapshot) => {
      const similarUsers = snapshot.docs.map(doc => doc.data());
      setSimilarUsers(similarUsers);
    })
  }

  // check how many people the user is following
  const getFollowingCount = async() => {
    db.collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .get()
    .then((querySnapshot) => {
      setFollowingCount(querySnapshot.size);
    })
  }

  // check how many followers the user has
  const getFollowerCount = async() => {
    db.collection('followers')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowers')
    .get()
    .then((querySnapshot) => {
      setFollowerCount(querySnapshot.size);
    })
  }

  // load the current user and similar users on page load
  useEffect(async () => {
    await getUser();
    // (not working) await getSimilarUsers();
    await getFollowingCount();
    await getFollowerCount();
  }, [])


  // fetch all posts for current user using id
  useEffect(() => {
    // create a reference to the posts collection
    const postsRef = db.collection('posts');
    // create a query against the collection
    const query = postsRef.where('user_id', '==', firebase.auth().currentUser.uid).orderBy('created_at', 'desc');
    // listen to the query
    query.onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => doc.data()));
    }
    );
  }, []);

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

  // render a component of recommended users
  const similarUsersComponent = () => {
    if(similarUsers.length > 0) {
      return (
        <View>
          <Text style={{fontSize: 16, fontWeight: '600', marginTop: 10,}}>Similar Users</Text>
        <View style={styles.similarUsersContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {similarUsers.map((user, index) => { 
          return (
            <View key={index} style={styles.similarUser}>
              <Image source={{uri: user.profile_picture}} style={styles.similarUserImage} />
              <Text style={styles.similarUserName}>{user.name}</Text>
              <TouchableOpacity style={styles.similarUserBtn}>
                <Text style={{color: '#FFF'}}>View Profile</Text>
              </TouchableOpacity>
            </View>
          )
        })}
        </ScrollView>
        </View>
        </View>
      )
    }
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
    getUser();
    wait(1500).then(() => setRefreshing(false));
  }

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
    <View style={{marginTop: 40,}}>
    <Ionicons name="menu" size={32} color="#000" style={{marginLeft: 5}} onPress={() => navigation.openDrawer()}></Ionicons>
    </View>
    <View style={styles.image_container}>
    <View style={{alignItems: 'center'}}>
      <Image source={{url: profilePicture}}  style={styles.userImg} />
    </View>
    <View style={{alignItems: 'center'}}>
      <Text style={styles.username}>{text}</Text>
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
      <View>
      <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('Edit Profile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      </View>
      <View style={{marginLeft: 20, marginTop: 0}}>
      <View style={styles.aboutMe}>
        {aboutMeComponent()}
      </View>
      <View style={styles.similarUsers}>
        {similarUsersComponent()}
      </View>
      </View>
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </ScrollView>
  );
}};

export default ProfileScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFF',
  },  
  image_container:{
    alignItems: 'center',
  },
  userImg: {
    height: 125,
    width: 125,
    borderRadius: 75,
  },
  username: {
    marginTop: 15,
    fontSize: 20,
  },
  counters_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
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
  editProfileBtn:{
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
  aboutMeContainer: {
    flexDirection: 'column',
  },
  aboutMeText:{
    fontSize: 14,
    marginLeft: 10,
  },
  similarUsersContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  similarUser:{
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#DEDEDE',
    borderRadius: 2,
    height: 160,
    width: 130,
    padding: 5,
  },
  similarUserImage:{
    height: 60,
    width: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  similarUserBtn:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 3,
    backgroundColor: '#0C4BAE',
    padding: 8,
  },
});