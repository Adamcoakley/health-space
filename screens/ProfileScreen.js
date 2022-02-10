import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const ProfileScreen = ({ navigation }) => { {
  return (
    <View>
      <Text> Profile Screen </Text>
    </View>
  );
}};

export default ProfileScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});