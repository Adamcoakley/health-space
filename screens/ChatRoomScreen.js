import React, { useState, useCallback, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
// gifted chat 
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
// icons
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const ChatRoomScreen = ({ navigation, route }) => { {
    // get the current user's name, profile picture and the other user's name, id and profile picture from the route
    const { currentUserName, currentUserPic, name, id, avatar } = route.params;
    // state variable to hold the messages
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
      // current user's id
      const uid = auth.currentUser.uid;

      /* 
      Note: uid + id will not work when generating a chatroom id 

      For example: uid = '123' and id = '456'. The chatroom id will be '123456'.

      However, when the current user is '456' and the other user is '123', the chatroom id will be '456123'

      To fix this, a ternary operator is used to generate the chatroom id. 
      if(uid > id) then id + uid else uid + id

      Now, since 123 is less than 456, the chatroom id will always be '123456' for both users. 
      */   

      const docId = uid > id ? id + "-" + uid : uid + "-" + id;
      // create a reference to the chatroom's messages collection and order the messages by createdAt
      const ref = db.collection('chatrooms')
                            .doc(docId)
                            .collection('messages')
                            .orderBy('createdAt', 'desc')
      ref.onSnapshot(querySnapshot => {
        const allMessages = querySnapshot.docs.map(query => {
        // bug: sometimes the createdAt field was not being set, so we need to check if it is set or not 
        const data = query.data();
        if(data.createdAt){
          return {
            ...query.data(),
            createdAt: query.data().createdAt.toDate()
          }
        } else{
          return {
            ...query.data(),
            createdAt: new Date()
          }
        }
      })
      // update the messages state variable
      setMessages(allMessages);
      })

      // add the two user ids to the chatroom collection
      const chatroomRef = db.collection('chatrooms').doc(docId);
      chatroomRef.get().then(doc => {
        if(!doc.exists){
          chatroomRef.set({
            // create a user array and store two user objects
            // store the last message in the chatroom
            lastMessage: 'No messages yet.',
            createdAt: new Date(),
            users: [
              {
                id: uid,
                name: currentUserName,
                profile_picture: currentUserPic
              },
              {
                id: id,
                name: name,
                profile_picture: avatar
              }
            ]
          })
        }
      }
    )
    }, [])

    // function to send a message
    const onSend = useCallback((messageArray) => {
      const message = messageArray[0];
      const newMessage = {
        ...message,
        sentBy: auth.currentUser.uid,
        sendTo: id,
        createdAt: new Date(),
      };
      console.log(newMessage);
      // update the messages 
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
      const uid = auth.currentUser.uid;
      const docId = uid > id ? id + "-" + uid : uid + "-" + id;
      // add the message to the chatroom's messages collection
      db.collection('chatrooms')
      .doc(docId)
      .collection('messages')
      .add({
        ...newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // update the last message in the chatroom and the createdAt field
      db.collection('chatrooms')
      .doc(docId)
      .update({
        lastMessage: message.text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

    }, []);

    return (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser.uid,
        }}
        renderBubble={ (props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#0C4BAE',
                  padding: 2,
                },
                left: {
                  backgroundColor: '#dfe6e9',
                  padding: 2,
                }
              }}
            />
          )
        }}
        />
    )
  }
}

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})