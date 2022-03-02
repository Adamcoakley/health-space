import React, { Component, useState} from 'react';
import { View, Text,StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';

const PostScreen = ({ navigation }) => {{
  const [text, setText] = useState();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <TouchableOpacity>
          <Ionicons name='md-arrow-back' size={24}color='#000'></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{fontWeight:'700', marginTop: 5}}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/profile-pic.jpg')} style={styles.avatar}/>
        <TextInput 
        autoFocus={true}
        multiline={true}
        numberOfLines={4}
        style={{flex:1}}
        placeholder='Want to share something?'
        onChangeText={(text) => setText(text)}
        value={text}></TextInput>
      </View>
      <TouchableOpacity style={styles.photo}>
        <Ionicons name="md-camera" size={32} color="#000" onPress={pickImage}/>
      </TouchableOpacity>
      <View>
      {image != null ? (
      <View style={{marginHorizontal:32, marginTop:32, height:300}}>
          <Image source={{uri: image}} style={{width:'100%', height:'100%'}}></Image>
      </View> ) : ( <View /> )}
      </View>
      <View>
      {image != null ? (
        <TouchableOpacity>
          <Text onPress={(image) => setImage(null)} style={styles.removeText}> Remove </Text>
        </TouchableOpacity>
      ) : ( <View />)}
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    );
  }
}

export default PostScreen;

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFF'
      },
      header:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:35,
        paddingVertical:10,
        borderBottomWidth:1,
        borderBottomColor:'#D8D9DB'
      },
      inputContainer:{
        margin:32,
        flexDirection:'row',
      },
      avatar:{
        width:48,
        height:48,
        borderRadius:24,
        marginRight:16
      },
      photo:{
        alignItems:'flex-end',
        marginHorizontal:32
      },
      removeText:{
        color: 'red', 
        fontWeight: '700',
        textAlign: 'center',
        paddingTop: 10,
      }
})
