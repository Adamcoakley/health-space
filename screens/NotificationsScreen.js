import React, {useState, useEffect} from 'react';
import { StatusBar} from 'expo-status-bar';
import { RefreshControl, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
// icons
import Ionic from 'react-native-vector-icons/Ionicons';
// import notification component
// import Notification from '../components/Notification';
// navigation to comment screen
import { useNavigation } from '@react-navigation/native';
// import swipeable from 'react-native-swipeable';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const NotificationsScreen = ({ navigation }) => {{
  // state variables 
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // timeout while the page is loading
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  // function to refresh the page
  const onRefresh = () => {
    setRefreshing(true);
    getNotifications();
    wait(1500).then(() => setRefreshing(false));
  }


  // get all the notifications for the current user
  // order the posts by the time they were created
  const getNotifications = async() => {
    db.collection('notifications')
    .doc(firebase.auth().currentUser.uid)
    .collection('allNotifications')
    .orderBy('time', 'desc')
    .onSnapshot(snapshot => {
      const notifications = snapshot.docs.map(doc => doc.data());
      setNotifications(notifications);
    });
  }

  // get the notifications when the page is loaded
  useEffect(async() => {
    await getNotifications();
  }, []);


  const Notification = ({ notification }) => {
    const navigation = useNavigation();
  
    // on right swipe, show the delete button to remove a notification 
    const rightSwipe = () => {
      return (
      <TouchableOpacity style={{width: 90, backgroundColor: '#fc4235', justifyContent: 'center', alignItems: 'center'}} onPress={removeNotification}>
          <Ionic name="md-trash-bin" size={28} color="#FFF"/>
      </TouchableOpacity>
      );
     };
  
    // function to remove the notification from the database
    const removeNotification = async() => {
      db.collection('notifications')
      .doc(firebase.auth().currentUser.uid)
      .collection('allNotifications')
      .doc(notification.id)
      .delete()
      .then(() => {
        console.log('notification deleted');
        console.log(notification.id);
      })
      .catch(error => {
        console.log(error);
      });
    }
  
    return (
      <Swipeable renderRightActions={rightSwipe}>
        <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* Navigate to another user's screen on profile picture or name press */}
          <TouchableOpacity>
              <Image source={{url: notification.profile_picture}} style={styles.profile_picture}/>
          </TouchableOpacity>
          {/* Padding to create space between the profile picture and the user's name */}
          <View style={{paddingLeft: 10}}>
              <TouchableOpacity>
                <Text style={{fontSize: 15, fontWeight: '500',}}>{notification.name}</Text>
              </TouchableOpacity>
              <Text style={{paddingTop: 5}}>{notification.text}</Text>
          </View>
          </View>
        </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.background}>
      <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        />
      }>
      {notifications.map((notification, index) => (
        <Notification notification={notification} key={index} />
      ))}
      </ScrollView>
    </View>
  );
}};

export default NotificationsScreen;

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: {
      paddingBottom: 5,
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
});