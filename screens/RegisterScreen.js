import React, {useState} from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
//import custom components
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

const RegisterScreen = ({ navigation }) => { 
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPass, setConfirmPass] = useState();

    return(
    <View style={styles.container}>
        <Image source={require('../assets/register.png')} resizeMode='contain' style={styles.image} /> 
        <Text style={styles.heading}>Let's Get Started!</Text>
        <Text style={styles.subHeading}>Create an account to continue</Text> 
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
            onPress={() => alert('Button Clicked')} />
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.haveAccountText}> Already have an account? <Text style={styles.signInText}>Sign in! </Text></Text>
      </TouchableOpacity>
    </View>
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
    image:{
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