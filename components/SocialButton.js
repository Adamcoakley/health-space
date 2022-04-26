import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// component used for facebook and google login buttons
const SocialButton = ({ title, type, color, backgroundColor, ...rest}) => {
  let buttonColor = backgroundColor;
  return (
    <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: buttonColor}]} {...rest}>
      <View style={styles.iconWrapper}>
        <FontAwesome name={type} style={styles.icon} size={22} color={color} />
      </View>
      <View style={styles.btnTxtWrapper}>
        <Text style={[styles.buttonText, {color: color}]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    height: windowHeight / 18,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 3,
    marginTop: 15,
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Verdana',
  },
});