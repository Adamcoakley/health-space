import React, {useState} from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
//import components
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

const LoginScreen = ({ navigation }) => { 
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    return(
    <View style={styles.container}>
        <Image source={require('../assets/login.png')} resizeMode='contain' style={styles.image} /> 
        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.subHeading}>Sign in to continue</Text> 
        <FormInput
            labelValue={email}
            onChangeText={(email) => setEmail(email)}
            iconType='mail'
            placeholder='Email Address'
            keyboardType='email-address'
            autoCapitalise='none'/> 
        <FormInput
            labelValue={password}
            onChangeText={(password) => setPassword(password)}
            iconType='lock'
            placeholder='Password'
            keyboardType='email-address'/> 
        <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <View style={styles.forgotButtonContainer}>
            <Text style={styles.forgotButtonText}>Forgot Password?</Text> 
        </View>
        </TouchableOpacity> 
        <FormButton 
            title="Sign In" 
            onPress={() => navigation.navigate('HomeTabs')} />
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
    </View>
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
    image:{
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