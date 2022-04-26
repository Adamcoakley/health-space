import React, { Component, useState, useEffect} from 'react';
import { Alert, View, Text,StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
// icons
import { Ionicons } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
// image picker
import * as ImagePicker from 'expo-image-picker';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';
// image storage
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

const PostScreen = ({ navigation }) => {{
  // state variables
  // the posts text input and image
  const [text, setText] = useState();
  const [image, setImage] = useState(null);
  //user data
  const [userId, setUserId] = useState();
  const [name, setName] = useState();
  const [profilePicture, setProfilePicture] = useState(); 
  const [email, setEmail] = useState(); 
  const [token, setToken] = useState();

  // a function to launch the image library, allowing the user to select an image
  const pickImage = async () => {
    // No permissions request are necessary
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // get the user's token for from user's collection 
  const getToken = async () => {
    const data = await db.collection('users').doc(firebase.auth().currentUser.uid).get();
    setToken(data.data().token);
    // check if token is null
    if (token === null) {
      setToken('');
    }
  };

  // get the current user's info 
  const getUser = async() => {
    db.collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setProfilePicture(documentSnapshot.data().profile_picture);
        setName(documentSnapshot.data().name);
        setUserId(documentSnapshot.data().id);
      }
    })
  }

  // get the current user on page load
  useEffect(() => {
    getToken();
    getUser();
    console.log('token', token);
  }, []);
      
  //handle the post's submission 
  const submitPost = async () => {
    // get the current time
    const time = new Date().getTime();
    let downloadURL = null;
    // check if image is null 
    if(image === null) {
      console.log('no image');
    } else {
      // upload the image to firebase storage
      //upload the image to firebase storage
      // create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg'
      };
      // upload the image to firebase storage
      const result = await fetch(image);
      // get the blob of the image
      const blob = await result.blob();
      // create a reference to the location where we want to store the image
      const storage = getStorage();
      const storageRef = ref(storage, 'posts/' + time + '.jpg');
      // upload the image to the storage reference
      const uploadTask = await uploadBytesResumable(storageRef, blob, metadata);
      // get the download url of the image
      downloadURL = await getDownloadURL(storageRef);
      console.log('downloadURL', downloadURL);
    }

    // get a reference to the document
    const docRef = db.collection('posts').doc();
    // create a new post object
    const post = {
      id: docRef.id,
      user_id: userId,
      name: name,
      profile_picture: profilePicture,
      text: text,
      image: downloadURL,
      time: time,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      report_count: 0,
      token: token,
    };

    // add the post to the database
    docRef.set(post)
    // alert the user that the post was submitted 
    .then(() => {
      setText('');
      setImage(null);
      console.log('Post added');
      navigation.navigate('Home');
      Alert.alert(
        "Post Submitted",
        "Your post has been submitted",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack() }
        ],
        { cancelable: false }
      );
    })
    .catch((error) => {
      console.log('Error adding document: ', error);
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <TouchableOpacity>
          <Ionicons name='md-arrow-back' size={24}color='#000'></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity onPress={submitPost}>
          <Text style={{color:'#000', fontWeight: 'bold', marginTop: 2}}>Submit Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Image source={{uri: profilePicture}} style={styles.avatar}/>
        <TextInput 
        autoFocus={true}
        multiline={true}
        numberOfLines={4}
        style={{flex:1}}
        placeholder='Want to share something?'
        onChangeText={(text) => setText(text)}
        value={text}></TextInput>
        <TouchableOpacity style={styles.photoIcon}>
          <Ionicons name="md-camera" size={32} color="#000" onPress={pickImage}/>
        </TouchableOpacity>
      </View>
      <View>
      {image != null ? (
      <View style={{marginHorizontal:32, marginTop:10, height:300}}>
          <Image source={{uri: image}} style={{width:'100%', height:'100%'}}></Image>
      </View> ) : ( <View /> )}
      {image != null ? (
        <TouchableOpacity>
          <Text onPress={(image) => setImage(null)} style={styles.removeText}> Remove </Text>
        </TouchableOpacity>
      ) : ( <View />)}
      </View>
      <View style={{alignItems: 'center'}}>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    );
  }
}

export default PostScreen;

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFF'
      },
      header:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:35,
        paddingVertical:10,
        borderBottomWidth:1,
        borderBottomColor:'#D8D9DB'
      },
      inputContainer:{
        margin:32,
        flexDirection:'row',
      },
      avatar:{
        width:48,
        height:48,
        borderRadius:24,
        marginRight:16
      },
      photoIcon:{
        alignItems:'flex-end',
        marginHorizontal: 10
      },
      removeText:{
        color: 'red', 
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
      },
})
