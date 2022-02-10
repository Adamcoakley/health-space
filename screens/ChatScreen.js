import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const ChatScreen = ({ navigation }) => { {
  return (
    <View>
      <Text> Chat Screen </Text>
    </View>
  );
}};

export default ChatScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});