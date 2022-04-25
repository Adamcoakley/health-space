import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
// divider between comments
import { Divider } from 'react-native-elements';
// icons 
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//navigation to comment screen
import { useNavigation } from '@react-navigation/native';

const Comment = ({ comment }) => {
  const navigation = useNavigation();
  return (
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* Navigate to another user's screen on profile picture or name press */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {profile_picture: comment.profile_picture, name: comment.name})}>
            <Image source={{url: comment.profile_picture}} style={styles.profile_picture}/>
        </TouchableOpacity>
        {/* Padding to create space between the profile picture and the user's name */}
        <View style={{paddingLeft: 10}}>
            <TouchableOpacity>
              <Text style={{fontSize: 15, fontWeight: '500',}}>{comment.name}</Text>
            </TouchableOpacity>
            <View style={{width: '87%'}}>
              <Text style={{paddingTop: 5}}>{comment.text}</Text>
            </View>
        </View>
        </View>
        <Feather name="more-vertical" style={{fontSize: 20}} />
      </View>
      </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
    container: {
      paddingBottom: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.1,
    }, 
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
    },
    profile_picture:{
       width: 40, 
       height: 40, 
       borderRadius: 100,
       marginTop: 0,
    },
    textContainer:{
      marginHorizontal: 15,
    },
    likeAndComment:{
      flex: 1,
      flexDirection: "row",
    }
});