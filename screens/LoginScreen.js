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
            autoCapitalise='none'
            autoCorrect='false' /> 
        <FormInput
            labelValue={password}
            onChangeText={(password) => setPassword(password)}
            iconType='lock'
            placeholder='Password'
            keyboardType='email-address'
            secureTextEntry='True' /> 
        <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
            <Text style={styles.forgotButtonText}>Forgot Password?</Text> 
        </TouchableOpacity> 
        <FormButton 
            title="Sign In" 
            onPress={() => alert('Button Clicked')} />
        <Text style={styles.connectUsingText} > Or connect using </Text>
        <SocialButton 
            title='Sign in with Facebook' 
            type='facebook' 
            color='#FFF' 
            backgroundColor='#0C4BAE'/>
        <SocialButton 
            title='Sign in with Google' 
            type='google' 
            color='#DE4D41' 
            backgroundColor='#F5E7EA'/>
        <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.navButtonText}> Don't have an account? Sign up! </Text>
      </TouchableOpacity>
    </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        //justifyContent: 'center',
        alignItems: 'center',
    },
    image:{
        width: 400,
        height: 200,
        marginTop: 60,
    },
    heading:{
        fontFamily: 'Verdana',
        fontSize: 25,
        marginBottom: 10,
    },
    subHeading:{
        fontFamily: 'Verdana',
        fontSize: 14,
    },
});