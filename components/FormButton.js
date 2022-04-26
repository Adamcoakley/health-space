import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// mobile window height and width from Dimensions
import {windowHeight, windowWidth} from '../utils/Dimensions';

// form button for login and register screens
const FormButton = ({ navigation, title, ...rest }) => {
    return(
    <TouchableOpacity style={styles.container} {...rest}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
    );
};

export default FormButton;

const styles = StyleSheet.create({
    container:{
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: '#0C4BAE',
        width: '80%',
        height: windowHeight / 18,
    }, 
    text:{
        fontSize: 14,
        color: '#FFF',
        fontFamily: 'Verdana',
    }
});