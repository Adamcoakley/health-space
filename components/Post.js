import React, {useState, useEffect} from 'react';
import { Alert, View, Text, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
// divider between posts
import { Divider } from 'react-native-elements';
// icons 
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// navigation to comment screen
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
// notifications 
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
// firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const PostHeader = ({ post }) => {

  // function to update the post's report count when the report button is pressed
  const reportPost = () => {
    db.collection('posts').doc(post.id).update({
      report_count: post.report_count + 1,
    }).then(() => {
      // then alert the user that the report has been submitted
      Alert.alert(
        "Report Submitted",
        "We will review it shortly.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }).catch((error) => {
      console.log('Error updating report count: ', error);
    }
  );
  }

  // function navigate to another user's profile
  const navigateToAnotherUser = () => {
    if (post.user_id === auth.currentUser.uid) {
      // do nothing if the user is viewing their own profile
    } else{
      // pass the params to the other user's screen
      navigation.navigate('Profile', {profile_picture: post.profile_picture, name: post.name, user_id: post.user_id});
    }
  }

  // function to delete a post 
  const deletePost = () => {
    db.collection('posts').doc(post.id).delete().then(() => {
      // then alert the user that the post has been deleted
      Alert.alert(
        "Success!",
        "Your post has been deleted.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }).catch((error) => {
      console.log('Error deleting post: ', error);
    }
  );
  }

  // check if the user is the creator of the post
  const isCreator = () => {
    // if they are they can report and delete the post
    if (post.user_id === auth.currentUser.uid) {
      return (
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption text='Report' customStyles={optionStyles} onSelect={reportPost} />
          <MenuOption text='Delete' customStyles={optionStyles} onSelect={deletePost} />
        </MenuOptions>
      )
    } else {
      // if they are not they can only report the post
      return (
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption text='Report' customStyles={optionStyles} onSelect={reportPost} />
        </MenuOptions>
      )
    }
  }

  const navigation = useNavigation();
  return(
  <View style={styles.header}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {/* Navigate to another user's screen on profile picture or name press */}
      <TouchableOpacity onPress={navigateToAnotherUser}>
        <Image source={{url: post.profile_picture}} style={styles.profile_picture}/>
      </TouchableOpacity>
      {/* Padding to create space between the profile picture and the user's name */}
      <View style={{paddingLeft: 10}}>
        <TouchableOpacity onPress={navigateToAnotherUser}>
          <Text style={{fontSize: 15, fontWeight: '500',}}>{post.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
    {/* Allow users to report posts */}
    <Menu>
    <MenuTrigger>
      <Feather name="more-vertical" style={{fontSize: 20}}/>
    </MenuTrigger>
    {isCreator()}
    </Menu>
  </View>
)}

const Post = ({ post }) => {
  const navigation = useNavigation();
  // state variables
  const [like, setLike] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [user, setUser] = useState('');

  // get the currrent user
  const getUser = async () => {
    db.collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setUser(documentSnapshot.data());
      }
    })
  }

  // check to see if the current user has liked the post
  const checkLike = () => {
    db.collection('likes')
      .doc(post.id)
      .collection('likedBy')
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setLike(true);
        } else {
          setLike(false);
        }
      })
      .catch((error) => {
        console.log('Error getting document: ', error);
      });
  }

  // function to handle like button press
  const handleLike = () => {
    // if the user has liked the post, unlike the post
    if (like) {
      db.collection('likes')
      .doc(post.id)
      .collection('likedBy')
      .doc(auth.currentUser.uid)
      .delete()
      .then(() => {
        setLike(false);
        setNumOfLikes(numOfLikes - 1);
      }).catch((error) => {
        console.log('Error removing like: ', error);
      });
    } else {
      // if the user has not liked the post, like the post
      db.collection('likes')
      .doc(post.id)
      .collection('likedBy')
      .doc(auth.currentUser.uid)
      .set({})
      .then(() => {
        setLike(true);
        setNumOfLikes(numOfLikes + 1);
      }).catch((error) => {
        console.log('Error adding like: ', error);
      });
    
      // if a token exists, send a notification to the user
      if(post.token) {
        sendPushNotification(post.token);
        console.log('Notification sent to: ' + post.token);
      }
      
      // store the notification in the database for ui purposes
      // including the document id so that the notification can be deleted later if needed
      const newDocRef = db.collection('notifications').doc(post.user_id).collection('allNotifications').doc();
      newDocRef.set({
        profile_picture: user.profile_picture,
        name: user.name,
        text: 'liked your post',
        time: firebase.firestore.FieldValue.serverTimestamp(),
        id: newDocRef.id
      })
    }
  }

  // function to get the posts number of likes
  const getNumOfLikes = () => {
    db.collection('likes')
    .doc(post.id)
    .collection('likedBy')
    .get()
    .then((querySnapshot) => {
      setNumOfLikes(querySnapshot.size);
    }).catch((error) => {
      console.log('Error getting number of likes: ', error);
    });
  }
  
  // send a push notification when the post is liked
  const sendPushNotification = async (token) => {
    const message = {
      to: token,
      sound: 'default',
      title: 'HealthSpace',
      body: user.name + ' liked your post.',
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

  useEffect(async () => {
    await getUser();
    await getNumOfLikes();
    await checkLike();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <PostHeader post={post}/>
        {/* User's text from the post */}
        <View style={styles.textContainer}>
        <Text>{post.text}</Text>
        </View>
        {/* If there is no image posted, there is no need to create space for an image */}
        <View>
          {post.image != null ? (
            <Image source={{uri: post.image}} style={{width: '100%', height: 200, marginTop: 15,}}/>
            ) : ( <View /> )}
        </View>
        {/* Icon and likes container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}>
          {/* Icon and likes count -  */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign name='like2' style={{fontSize: 15, paddingRight: 2, color: '#0C4BAE'}}/>
            <Text style={{fontSize: 12}}>
            Liked by{like ? ' you and' : ''}{' '}
            {like ? numOfLikes -1: numOfLikes} others {/* -1 to remove your own like once liked */}
            </Text>
          </View>
        </View>
        {/* Like and comment section */}
        <Divider width={0.3} style={{marginBottom: 8}}/>
        <View style={styles.likeAndComment}>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", justifyContent: 'center'}}>
          <TouchableOpacity onPress={handleLike}>
            <AntDesign  name={like ? 'like1' : 'like2'}  
            style={{
                  paddingRight: 2,
                  fontSize: 15,
                  color: like ? '#0C4BAE' : 'black', }}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike}>
              <Text style={{ color: like ? '#0C4BAE' : '#000', fontWeight: '400'}}> Like </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", justifyContent: 'center'}}>
            {/* on press navigate to the comment section, passing the posts details  */}
              <TouchableOpacity onPress={() => navigation.navigate('Comments', {profile_picture: post.profile_picture, name: post.name, text: post.text, like: like, likes: numOfLikes, image: post.image, id: post.id, user_id: post.user_id, token: post.token})}>
                <FontAwesome name='comment-o' style={{fontSize: 15, paddingRight: 2}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Comments', {profile_picture: post.profile_picture, name: post.name, text: post.text, like: like, likes: numOfLikes, image: post.image, id: post.id, user_id: post.user_id, token: post.token})}>
                <Text style={{fontWeight: '400'}}> Comment </Text>
              </TouchableOpacity>
          </View>
        </View>
        <Divider width={8} style={{paddingTop: 8}}/>
      </View>
    </View>
  );
};

export default Post;

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 5,
    width: '20%',
  }
};

const optionStyles = {
  optionWrapper: {
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  }
};

const styles = StyleSheet.create({
    container: {
      paddingBottom: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.1,
    }, 
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
    },
    profile_picture:{
       width: 40, 
       height: 40, 
       borderRadius: 100
    },
    textContainer:{
      marginHorizontal: 15,
    },
    likeAndComment:{
      flex: 1,
      flexDirection: "row",
    }
});