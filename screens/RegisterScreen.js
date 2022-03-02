import React, {useState} from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, 
        TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
        import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
//import custom components
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const RegisterScreen = ({ navigation }) => { 
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPass, setConfirmPass] = useState();
    const [image, setImage] = useState(null);

    const onSignup = async () => {
        try {
            const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(data => {
                db.collection('users').add({
                user_id: data.user.uid,
                name: name,
                email: data.user.email,
                profile_picture: image,
                })
            })
        } catch (error) {
            console.log(error)
        }
    } 

    // handle the user's profile picture 
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
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
            keyboardType='email-address'
            autoCapitalise='none' /> 
        <FormInput
            labelValue={email}
            onChangeText={(email) => setEmail(email)}
            iconType='mail'
            placeholder='Email Address'
            keyboardType='email-address'
            autoCapitalise='none' /> 
        <FormInput
            labelValue={password}
            onChangeText={(password) => setPassword(password)}
            iconType='lock'
            placeholder='Password'
            keyboardType='email-address' /> 
        <FormInput
            labelValue={confirmPass}
            onChangeText={(confirmPass) => setConfirmPass(confirmPass)}
            iconType='lock'
            placeholder='Confirm Password'
            keyboardType='email-address' /> 
        <FormButton 
            title="Sign Up" 
            onPress={onSignup} />
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