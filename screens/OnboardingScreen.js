import React from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({ navigation }) => {
    return(
    <Onboarding
    onSkip={() => navigation.replace('LoginScreen')}
    onDone={() => navigation.navigate('LoginScreen')}
    pages={[ {
      backgroundColor: '#0C4BAE',
      image: <Image style={{ width: 100, height: 100 }} source={require('../assets/post.png')} />,
      title: 'Posts',
      subtitle: 'Share health-related posts, photos and comments with people of similar heath interests',
    },
    {
      backgroundColor: '#0C4BAE',
      image: <Image style={{ width: 100, height: 100 }} source={require('../assets/like.png')} />,
      title: 'Reactions',
      subtitle: 'React to posts and photos with likes, dislikes and more',
    },
    {
      backgroundColor: '#0C4BAE',
      image: <Image style={{ width: 100, height: 100 }} source={require('../assets/group.png')} />,
      title: 'Groups',
      subtitle: 'Join and connect with groups of people with similar health interests',
    },
    {
      backgroundColor: '#0C4BAE',
      image: <Image style={{ width: 100, height: 100 }} source={require('../assets/chat.png')} />,
      title: 'Chat',
      subtitle: 'Communicate with people of similar health interests via private messages',
    },
    ]} 
    />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});