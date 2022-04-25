import React, {useState} from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
// KeyboardAwareScrollView: does not hide the input when the keyboard is shown
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// icons 
import {Ionicons} from '@expo/vector-icons';
// image picker
import * as ImagePicker from 'expo-image-picker';
// import custom components
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
// firebase
import firebase from 'firebase/compat/app';
import { auth, db, firebaseConfig } from '../config/Firebase';
// image storage
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

const RegisterScreen = ({ navigation }) => { 
    // state variables 
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPass, setConfirmPass] = useState();
    const [image, setImage] = useState(null);

    // function to launch the image library, allowing the user to select an image
    const pickImage = async () => {
        // no permissions request are necessary
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    // function to handle the sign up process
    const handleSignup = async (image) => {
        // get the current time
        const time = new Date().getTime();

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
        const storageRef = ref(storage, 'images/' + time + '.jpg');
        // upload the image to the storage reference
        const uploadTask = await uploadBytesResumable(storageRef, blob, metadata);
        // get the download url of the image
        const downloadURL = await getDownloadURL(storageRef);

        // lowercase the email
        const newEmail = email.toLowerCase();
        setEmail(newEmail);
        
        // store the user's information in firebase
        if(password === confirmPass) {
            auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                // get the user's id
                const user_id = auth.currentUser.uid;
                // create a reference to the user's profile
                const userRef = db.collection('users').doc(user_id);
                // create a new document in the user's profile
                userRef.set({
                    name: name,
                    email: email,
                    profile_picture: downloadURL,
                    id: user_id,
                    created_at: time,
                    bio: '',
                    condition: '',
                    token: '',
                });
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            alert('Passwords do not match');
        }
    };

    return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView 
        style={{backgroundColor: '#fff'}}
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={false}
        >
        <Image source={require('../assets/illustration-two.png')} resizeMode='contain' style={styles.illustration} /> 
        <Text style={styles.heading}>Let's Get Started!</Text>
        <Text style={styles.subHeading}>Create an account to continue</Text> 
        <TouchableOpacity style={styles.avatarPlaceholder} onPress={pickImage}>
            <Image source={{uri: image}} style={styles.avatar} />
            <Ionicons name="ios-add" size={32} color="#FFF" style={styles.image}></Ionicons>
        </TouchableOpacity>
        <FormInput
            labelValue={name}
            onChangeText={(name) => setName(name)}
            iconType='user'
            placeholder='Full Name'
            keyboardType='email-address' /> 
        <FormInput
            labelValue={email}
            onChangeText={(email) => setEmail(email)}
            iconType='mail'
            placeholder='Email Address'
            autoCapitalize='none'
            keyboardType='email-address' /> 
        <FormInput
            labelValue={password}
            onChangeText={(password) => setPassword(password)}
            iconType='lock'
            placeholder='Password'
            secureTextEntry={true} /> 
        <FormInput
            labelValue={confirmPass}
            onChangeText={(confirmPass) => setConfirmPass(confirmPass)}
            iconType='lock'
            placeholder='Confirm Password'
            secureTextEntry={true}  /> 
        <FormButton 
            title="Sign Up" 
            onPress={() => handleSignup(image)} />
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.haveAccountText}> Already have an account? <Text style={styles.signInText}>Sign in! </Text></Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustration:{
        width: 400,
        height: 200,
    },
    heading:{
        fontFamily: 'Arial',
        fontSize: 25,
        marginTop: 15,
    },
    subHeading:{
        fontFamily: 'Arial',
        fontSize: 15,
        marginTop: 15,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#e1e2e6',
        borderRadius: 50,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50
    },
    haveAccountText: {
        fontFamily: 'Arial',
        fontSize: 15,
        marginTop: 15,
    },
    signInText: {
        color: '#0C4BAE',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 15,
    }
});