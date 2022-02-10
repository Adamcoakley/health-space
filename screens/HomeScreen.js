import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const HomeScreen = ({ navigation }) => { {
  return (
    <TouchableOpacity>
      <Text> Sign up! </Text>
    </TouchableOpacity>
  );
}};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});