import React, {useState} from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
// KeyboardAwareScrollView: does not hide the inputs when the keyboard is open
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import components
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const LoginScreen = ({ navigation }) => { 
    // state variables for the email and password
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // function to handle login
    const onLogin = () => {
        // set email to all lowercase
        const newEmail = email.toLowerCase();
        setEmail(newEmail);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log("Firebase login succesfull:", email, password)
        })
        .catch((error) => {
            console.log("Firebase login failed:", email, password)
        })
    } 

    return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView 
        style={{backgroundColor: '#fff'}}
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={false}
        >
        <Image source={require('../assets/illustration-one.png')} resizeMode='contain' style={styles.illustration} />
        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.subHeading}>Sign in to continue</Text> 
        <FormInput
            labelValue={email}
            onChangeText={(email) => setEmail(email)}
            iconType='mail'
            placeholder='Email Address'
            autoCapitalise='none'/> 
        <FormInput
            labelValue={password}
            onChangeText={(password) => setPassword(password)}
            iconType='lock'
            placeholder='Password'
            secureTextEntry={true}/> 
        <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <View style={styles.forgotButtonContainer}>
            <Text style={styles.forgotButtonText}>Forgot Password?</Text> 
        </View>
        </TouchableOpacity> 
        <FormButton 
            title="Sign In" 
            onPress={onLogin} />
        <Text style={styles.connectUsingText} > Or connect using </Text>
        <SocialButton 
            title='Sign in with Facebook' 
            type='facebook' 
            color='#4867AA' 
            backgroundColor='#E6EAF4'/>
        <SocialButton 
            title='Sign in with Google' 
            type='google' 
            color='#DE4D41' 
            backgroundColor='#F5E7EA'/>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.noAccountText}> Don't have an account? <Text style={styles.signUpText}> Sign up! </Text></Text>
        </TouchableOpacity>
    </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    );
};

export default LoginScreen;


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
    },
    subHeading:{
        fontFamily: 'Arial',
        fontSize: 15,
        marginTop: 15,
    },
    forgotButton:{
        alignSelf: 'flex-end',
        marginRight: '10%',
        marginTop: 15,
    },
    forgotButtonText:{
        fontFamily: 'Arial',
        fontSize: 14,
    },
    connectUsingText: {
        fontFamily: 'Arial',
        fontSize: 14,
        marginTop: 15,
    },
    noAccountText: {
        fontFamily: 'Arial',
        fontSize: 15,
        marginTop: 15,
    },
    signUpText: {
        color: '#0C4BAE',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 15,
    }
});