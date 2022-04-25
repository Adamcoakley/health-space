import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
// icons
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const CreateChatScreen = ({ navigation }) => { {

    // get all users from the firebase database
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentUserPic, setCurrentUserPic] = useState('');

    // get all users except for the current user
    const getUsers = async () => {
        const users = [];
        await db.collection('users').where('email', '!=', auth.currentUser.email).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                users.push(doc.data());
            });
        });
        setUsers(users);
        setFilteredUsers(users);
    }

    // get current user from the firebase database
    const getCurrentUser = async () => {
        await db.collection('users').where('email', '==', auth.currentUser.email).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                setCurrentUserName(doc.data().name);
                setCurrentUserPic(doc.data().profile_picture);
            });
        });
    }

    // get the users and the current user when the screen is loaded
    useEffect(() => {
        getUsers();
        getCurrentUser();
    }, []);

    // function to filter the users based on the search input
    const searchFilter = (text) => {
      if(text){  
          const newData = users.filter(user => {
              const userData = user.name ? user.name.toUpperCase() : ''.toUpperCase();
              const textData = text.toUpperCase();
              return userData.indexOf(textData) > -1;
          })
          setFilteredUsers(newData);
          setSearch(text);
      } else {
          setFilteredUsers(users);
          setSearch('');
      }
  }
  
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.search} 
        placeholder="Search for a user.." 
        onChangeText={(text) => searchFilter(text)} 
        value={search} />
      <ScrollView> 
        {filteredUsers.map((user, index) => (
          <TouchableOpacity key={index} style={styles.userContainer}
          onPress={() => navigation.navigate('Messages', {currentUserName: currentUserName, currentUserPic: currentUserPic, name: user.name, id: user.id, avatar: user.profile_picture})}>
            <Image source={{uri: user.profile_picture}} style={styles.image} /> 
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}};

export default CreateChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  search: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
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
});
