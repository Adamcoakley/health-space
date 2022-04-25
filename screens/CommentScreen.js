import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import { Divider } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Comment from '../components/Comment';
// to ensure the keyboard doesn't go over the input box
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const CommentScreen = ({ route, navigation }) => { {
  const {profile_picture, name, text, like, likes, image, id, user_id, token} = route.params;  
  // state variables for the current user and their profile picture
  const [user, setUser] = useState(null)
  const [userPic, setUserPic] = useState();
  // state variables to deal with a single comment + load all comments for current post
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  // get the current user's information
  const getUser = async () => {
    db.collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setUser(documentSnapshot.data());
        setUserPic(documentSnapshot.data().profile_picture);
        console.log('User Data', documentSnapshot.data());
      } else{
        console.log('User not found');
      }
    })
  }

  // get all comments for the current post
  const getComments = async () => {
    db.collection('posts')
    .doc(id)
    .collection('comments')
    .orderBy('timestamp', 'desc')
    .get()
    .then((querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push(doc.data());
      });
      setComments(comments);
    })
  }

  // load the current user, post ID and comments upon opening the screen
  useEffect(async () => {
    await getUser();
    await getComments();
    console.log('Token', token);
    console.log('User ID', user_id);
  }, []);

  // send a push notification when someone comments on a post
  const sendPushNotification = async (token) => {
    const message = {
      to: token,
      sound: 'default',
      title: 'HealthSpace',
      body: user.name + ' commented on your post.',
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

    
  // submit comment to firebase
  const submitComment = async() => {
    db.collection('posts')
    .doc(id)
    .collection('comments')
    .add({
        name: user.name,
        profile_picture: userPic,
        text: comment,
        likes: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        setComment('');
        Keyboard.dismiss();
        // reload comments
        getComments();
        // send a push notification if if the author of the post is not the current user and has a notification token
        if(token) {
          sendPushNotification(token);
          console.log('Push notification sent');
        }
        // send notification to the owner of the post
        // including the document id so that the notification can be deleted later if needed
        const newDocRef = db.collection('notifications').doc(user_id).collection('allNotifications').doc();
        newDocRef.set({
          profile_picture: userPic,
          name: user.name,
          text: 'commented on your post',
          time: firebase.firestore.FieldValue.serverTimestamp(),
          id: newDocRef.id
        })
    })
    .catch((error) => {
        console.log('Error adding comment', error);
    });
  }  

  return (
  <ScrollView style={styles.container}>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  <KeyboardAwareScrollView 
        style={{backgroundColor: '#fff'}}
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={false}
        >
    <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: profile_picture}} style={styles.profile_picture}/>
        {/* Padding to create space between the profile picture and the user's name */}
        <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 15, fontWeight: '500',}}>{name}</Text>
        </View>
    </View>
        <Feather name="more-vertical" style={{fontSize: 20}} />
    </View>
    <View style={styles.textContainer}>
        <Text>{text}</Text>
    </View>
    {/* If there is no image posted, there is no need to create space for an image */}
    <View>
        {image != null ? (
        <Image source={{uri: image}} style={{width: '100%', height: 180, marginTop: 15,}}/>
        ) : ( <View /> )}
    </View>
    <View style={{
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
        Liked by {like ? 'you and' : ''}{' '}
        {like ? likes -1: likes} others
        </Text>
    </View>
    </View>
    {/* Add a comment (profile picture - text input ) */}
    <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: userPic}} style={styles.profile_picture}/>
        {/* Padding to create space between the current users picture and the text box */}
        <View style={{paddingLeft: 10}}>
            <TextInput style={{width: 250}} 
                       placeholder="Add a comment..." 
                       maxLength={120} multiline 
                       numberOfLines={4} 
                       onChangeText={(comment) => setComment(comment)}
                       value={comment}
                       />
        </View>
        </View>
        {/* Submit button */}
        <TouchableOpacity style={{paddingRight: 0}} onPress={submitComment}>
            <AntDesign name='rightcircle' style={{fontSize: 22, color: '#0C4BAE'}}/>
        </TouchableOpacity>
    </View>
    {/* Display all comments */}
    <View>
    {comments.map((comment, index) => (
      <Comment comment={comment} key={index} />
    ))}
    </View>
    </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    </ScrollView>
  );
}};

export default CommentScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
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
});