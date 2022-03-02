import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Divider } from 'react-native-elements';
import Header from '../components/Header';
import Stories from '../components/Stories';
import Post from '../components/Post';

const HomeScreen = ({ navigation }) => { {
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <Header />
    <Stories />
    <Divider width={8} style={{paddingTop: 5}}/>
    <Post/>
    </ScrollView>
    </SafeAreaView>
  );
}};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFF',
    },
});