import React from 'react';
import { Button, Image, Text, View } from 'react-native';
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
      subtitle: "Interact with other user's posts and photos with likes and comments",
    },
    {
      backgroundColor: '#0C4BAE',
      image: <Image style={{ width: 100, height: 100 }} source={require('../assets/link.png')} />,
      title: 'Connect',
      subtitle: 'Connect with those who share similar health interests and experiences',
    },
    {
      backgroundColor: '#0C4BAE',
      image: <Image style={{ width: 100, height: 100 }} source={require('../assets/chat.png')} />,
      title: 'Chat',
      subtitle: 'Communicate with people of similar health interests via private messaging',
    },
    ]} />
    );
};

export default OnboardingScreen;