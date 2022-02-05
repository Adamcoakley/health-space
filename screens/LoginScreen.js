import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
    return(
    <View style = { styles.container }>
    <Text>Login Screen</Text>
    <Button title='Click Here' onPress={() => navigation.navigate('OnboardingScreen')}/>
    </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});