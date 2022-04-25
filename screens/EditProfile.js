import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, TextInput, SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
// mobiles height and width
import {windowHeight, windowWidth} from '../utils/Dimensions';
// load all the conditions
import { conditions } from '../data/conditions';
// keyboard aware scroll view - does not hide text inputs when keyboard is open
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import SearchableDropdown component
import SearchableDropdown from 'react-native-searchable-dropdown';
// icons
import { Ionicons } from '@expo/vector-icons';
// image picker
import * as ImagePicker from 'expo-image-picker';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const EditProfile = ({ navigation }) => {

  // state variables
  const [profilePicture, setProfilePicture] = useState(); 
  const [newImage, setNewImage] = useState(null);
  const [name, setName] = useState();
  const [condition, setCondition] = useState();
  const [placeholder, setPlaceholder] = useState('Select a condition..');
  const [bio, setBio] = useState();

  // image picker 
  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
      });
      if (!result.cancelled) {
          setNewImage(result.uri);
      }
  };

  // function to get the current user's information
  const getUser = async() => {
    db.collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setName(documentSnapshot.data().name);
        setProfilePicture(documentSnapshot.data().profile_picture);
        console.log('User Data', documentSnapshot.data());
      } else{
        console.log('User not found');
      }
    })
  }

  // get the current user on page load
  useEffect(() => {
    getUser();
  }, []);

  // create a deep copy of the conditions array 
  // because I need to remove the description, symptoms, and treatment from the array
  // so that it can be used in a dropdown menu
  const items = JSON.parse(JSON.stringify(conditions));

  // remove attributes from conditions 
  // only need the name and id for dropdown menu
  items.forEach(items => {
    delete items.description;
    delete items.symptoms;
    delete items.treatment;
  });

  // function to handle dropdown menu change
  const handleConditionChange = (condition) => {
    setCondition(condition.name);
    console.log('Condition: ', condition.name);
    setPlaceholder(condition.name);
  };

  // function to handle submit
  const handleSubmit = async () => {
    // check if user has selected a condition
    if(condition === undefined) {
      // do nothing
    } else {
      // update user's condition
      db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        condition: condition
      })
      .then(() => {
        console.log('Condition updated');
      })
      .catch((error) => {
        console.log('Error updating condition: ', error);
      });
    }
    // update user's bio
    if(bio === undefined) {
      // do nothing
    } else {
      db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        bio: bio
      })
      .then(() => {
        console.log('Bio updated');
      })
      .catch((error) => {
        console.log('Error updating bio: ', error);
      });
    }
    // if any of the above are not empty, alert the user
    if(condition !== undefined || bio !== undefined) {
      Alert.alert(
        'Success!',
        'Your profile has been updated!',
        [
          {text: 'OK', onPress: () => navigation.navigate('ProfileScreen')},
        ],
        {cancelable: false},
      );
    }
  };
  
  return (  
    <SafeAreaView style={styles.container}>
      <View style={styles.content_container}>
      <View style={{alignItems: 'center'}}>
      <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            <Image source={{uri: profilePicture}} style={styles.image} />
            <Ionicons name="ios-add" size={32} color="#FFF"/>
      </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.username}>{name}</Text>
      </View> 
      </View>
      <View style={styles.info_container}>
      <Text style={styles.title}>Bio</Text>
      <TextInput style={styles.input} placeholder="Tell us about yourself.." onChangeText={setBio} />
        <Text style={styles.title}>Condition</Text>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          onItemSelect={(item) => handleConditionChange(item)}
           //suggestion container style
          containerStyle={{ padding: 5 }}
          //inserted text style
          textInputStyle={{ padding: 12, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#FAFAFA'}}
          itemStyle={{ padding: 10, marginTop: 2, backgroundColor: '#F5F5F5', borderColor: '#bbb', borderWidth: 1,}}
          itemTextStyle={{ color: '#222',}}
          //items container style you can pass maxHeight
          itemsContainerStyle={{ maxHeight: '60%'}}
          //mapping of item array (conditions)
          items={items}
          //place holder for the search input
          placeholder={placeholder}
          placeholderTextColor="#000"
          //reset textInput Value with true and false state
          resetValue={false}
          //To remove the underline from the android input
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.updateBtn} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFF',
  },  
  content_container:{
    alignItems: 'center',
    marginTop: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e1e2e6',
    borderRadius: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50
  },
  username: {
    marginTop: 15,
    fontSize: 20,
  },
  info_container:{
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  title:{
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 5,
  },
  input:{
    marginBottom: 15,
    marginLeft: 5,
  },
  updateBtn:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderRadius: 3,
    backgroundColor: '#0C4BAE',
    width: '100%',
    height: windowHeight / 20,
    borderColor: '#0C4BAE',
    borderWidth: 1,
  }, 
  buttonText:{
    color: '#FFF',
    fontSize: 18,
  }
});