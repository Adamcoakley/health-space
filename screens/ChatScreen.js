import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { RefreshControl, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
// icons
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const ChatScreen = ({ navigation }) => { {
  // state variables 
  const [chatrooms, setChatrooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // get all chat rooms to begin with 
  // these will be filtered later
  const getChatrooms = async () => {
    const chatrooms = [];
    await db.collection('chatrooms').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        chatrooms.push(doc.data());
      });
    });
    setChatrooms(chatrooms);

    // loop through all rooms to see if either of the ids match the current user
    // if they do, then add the room to the list of rooms
    const filteredChatrooms = [];
    chatrooms.forEach(room => {
        if(room.users[0].id === auth.currentUser.uid || room.users[1].id === auth.currentUser.uid){
            filteredChatrooms.push(room);
        }
    });
    setChatrooms(filteredChatrooms);
    
  }

  // get the chatrooms when the screen is loaded
  useEffect(() => {
    getChatrooms();
  }, []);
  
  // timeout function used when refreshing the chatrooms
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  // function to refresh the chatrooms 
  const onRefresh = () => {
    setRefreshing(true);
    getChatrooms();
    wait(1500).then(() => setRefreshing(false));
  }
  
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.left} />
      <View style={styles.middle}>
        <Text style={styles.text}>Chat</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => navigation.navigate('Users')}>
          <Ionicons name="create-sharp" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView style={{marginLeft: 15}} refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      {chatrooms.map((chatroom, index ) => (
        <View key={index} >
          <View style={{marginBottom: 15}}>
            {/* The chatroom contains two users in an array, so we need to check if the current user is the first or second user in the chatroom,
                if the array[0].id === auth.currentUser.uid, then the current user is the first user in the chatroom
                so we need to pass the second users name, id and avatar to the messages screen
            */}
            {chatroom.users[0].id === auth.currentUser.uid ? (
              <TouchableOpacity style={styles.chatroom} onPress={() => navigation.navigate('Messages', {name: chatroom.users[1].name, id: chatroom.users[1].id, avatar: chatroom.users[1].profile_picture})}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={{ uri: chatroom.users[1].profile_picture }} style={styles.profile_picture}/>
                <View style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 15, fontWeight: '500',}}>{chatroom.users[1].name}</Text>
                    <Text style={{paddingTop: 5}}>{chatroom.lastMessage}</Text>
                </View>
                </View>
              </TouchableOpacity>
            ) : ( 
              <TouchableOpacity style={styles.chatroom} onPress={() => navigation.navigate('Messages', {name: chatroom.users[0].name, id: chatroom.users[0].id, avatar: chatroom.users[0].profile_picture})}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={{ uri: chatroom.users[0].profile_picture }} style={styles.profile_picture}/>
                <View style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 15, fontWeight: '500',}}>{chatroom.users[0].name}</Text>
                    <Text style={{paddingTop: 5}}>{chatroom.lastMessage}</Text>
                </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
    </View>
  );
}};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'flex-end',
     backgroundColor: '#FFF',
     height: 50,
     marginTop: 45,
     borderBottomWidth: 0.5,
     borderBottomColor: '#E5E5E5',
     marginBottom: 10,
  },
  left: {
     width: 50,
     height: 50,
  },
  middle: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  profile_picture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
})