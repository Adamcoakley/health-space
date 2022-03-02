import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const NotificationsScreen = ({ navigation }) => { {
  return (
    <View style={styles.container}>
      <Text> Notifications Screen </Text> 
    </View>
  );
}};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});