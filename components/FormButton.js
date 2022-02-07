import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

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