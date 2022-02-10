import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


const GroupsScreen = ({ navigation }) => { {
  return (
    <View>
      <Text> Groups Screen </Text>
    </View>
  );
}};

export default GroupsScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});