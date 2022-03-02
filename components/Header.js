import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
//icons
import { Fontisto } from '@expo/vector-icons'; 
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const handleSignout = () => {
  try {
    firebase.auth().signOut()
    console.log('Signed out successfully')
  } catch (error) {
    console.log(error)
  }
}

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignout}>
        <Image 
        style={styles.logo}
        source={require('../assets/logo.png')} 
        />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
            <Fontisto 
            name="search" 
            size={22} 
            style={styles.icon}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    iconContainer:{
        marginRight: 10,
    },
    icon:{
        width: 30,
        height: 30,
    },
    logo:{
        width: 150,
        height: 50,
        resizeMode: 'contain',
    }
});