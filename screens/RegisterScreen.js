import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    return(
    <View style = { styles.container }>
    <Text>Register Screen</Text>
    <Button title='Click Here' onPress={() => navigation.navigate('LoginScreen')}/>
    </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});