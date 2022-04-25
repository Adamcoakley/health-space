import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
// icons
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { conditions } from '../data/conditions';
//import SearchableDropdown component
import SearchableDropdown from 'react-native-searchable-dropdown';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const SearchUserScreen = ({ navigation }) => { {

    // state variables
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [currentUserPic, setCurrentUserPic] = useState('');
    const [placeholder, setPlaceholder] = useState('Search for a condition..');
    const [id, setId] = useState('');
    const [conditionName, setConditionName] = useState();
    const [description, setDescription] = useState();
    const [symptoms, setSymptoms] = useState();
    const [treatment, setTreatment] = useState();

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
  
    // create a deep copy of the conditions array 
    // because I need to remove the description, symptoms, and treatment from the array
    // so that it can be used in a dropdown menu 
    const items = JSON.parse(JSON.stringify(conditions));

    // remove attributes from conditions 
    // only need the name and id for dropdown menu
    items.forEach(items => {
        delete items.description;
        delete items.symptoms;
        delete items.treatment;
    });

    // function to handle condtion selection
    const handleConditionChange = (item) => {
        setId(item.id);
        setName(item.name);
        // loop through the conditions array to find the condition that was selected
        // and set the description, symptoms, and treatment to the state variables
        for(let i = 0; i < conditions.length; i++) {
            if(conditions[i].id === item.id) {
                setDescription(conditions[i].description);
                setSymptoms(conditions[i].symptoms);
                setTreatment(conditions[i].treatment);
            }
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
          onPress={() => navigation.navigate('Profile', { user_id: user.id, profile_picture: user.profile_picture, name: user.name })}>
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

export default SearchUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
