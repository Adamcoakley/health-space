import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import { Divider } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { USERS } from '../data/users';

const Post = () => {
  const postInfo = [
    {
      user: USERS[0].user,
      postPersonImage: USERS[0].image,
      text: 'Hello all, this is a test post to see if my application is actually working.' 
       + ' I need to make it longer to see how it looks visually.',
      likes: 765,
      isLiked: false,
    },
    {
      user: USERS[1].user,
      postPersonImage: USERS[1].image,
      text: 'Hello all, this is a test post to see if my application is actually working.' 
       + ' I need to make it longer to see how it looks visually.',
      postImage: require('../assets/landscape.jpg'),
      likes: 345,
      isLiked: false,
    },
    {
      user: USERS[2].user,
      postPersonImage: USERS[2].image,
      text: 'Hello all, this is a test post to see if my application is actually working.' 
       + ' I need to make it longer to see how it looks visually.',
      postImage: require('../assets/landscape.jpg'),
      likes: 734,
      isLiked: false,
    },
    {
      user: USERS[3].user,
      postPersonImage: USERS[3].image,
      text: 'Hello all, this is a test post to see if my application is actually working.' 
       + ' I need to make it longer to see how it looks visually.',
      postImage: require('../assets/landscape.jpg'),
      likes: 875,
      isLiked: false,
    },
  ];

  return (
    <View>
      {postInfo.map((data, index) => {
        const [like, setLike] = useState(data.isLiked);
        return (
          <View key={index} style={styles.container}>
            <View style={styles.header}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={data.postPersonImage} style={styles.profile_picture}/>
                {/* Padding to create space between the profile picture and the user's name */}
                <View style={{paddingLeft: 5}}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>{data.user}</Text>
                </View>
              </View>
              <Feather name="more-vertical" style={{fontSize: 20}} />
            </View>
            {/* User's text from the post */}
            <View style={styles.textContainer}>
            <Text>{data.text}</Text>
            </View>
            {/* If there is no image posted, there is no need to create space for an image */}
            <View>
             {data.postImage != null ? (
               <Image source={data.postImage} style={{width: '100%', height: 200, marginTop: 15,}}/>
               ) : ( <View /> )}
            </View>
            {/* Icon and likes container */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>
              {/* Icon and likes count -  */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AntDesign name='like2' style={{fontSize: 15, paddingRight: 2, color: '#0C4BAE'}}/>
                <Text style={{fontSize: 12}}>
                Liked by{like ? ' you and' : ''}{' '}
                {like ? data.likes + 1 : data.likes} others
                </Text>
              </View>
            </View>
            {/* Like and comment section */}
            <Divider width={0.3} style={{marginBottom: 8}}/>
            <View style={styles.likeAndComment}>
              <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => setLike(!like)}>
                <AntDesign  name={like ? 'like1' : 'like2'}  
                style={{
                      paddingRight: 2,
                      fontSize: 15,
                      color: like ? '#0C4BAE' : 'black', }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLike(!like)}>
                <Text style={{ color: like ? '#0C4BAE' : '#000', fontWeight: '400'}}> Like </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", justifyContent: 'center'}}>
                <FontAwesome name='comment-o' style={{fontSize: 15, paddingRight: 2}}/>
                <Text style={{fontWeight: '400'}}> Comment </Text>
              </View>
            </View>
            <Divider width={8} style={{paddingTop: 8}}/>
          </View>
        );
      })}
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
    container: {
      paddingBottom: 10,
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
       borderRadius: 100
    },
    textContainer:{
      marginHorizontal: 15,
    },
    likeAndComment:{
      flex: 1,
      flexDirection: "row",
    }
});