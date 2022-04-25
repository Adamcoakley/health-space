import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, TextInput, SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import { conditions } from '../data/conditions';
//import SearchableDropdown component
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Ionicons } from '@expo/vector-icons';
//firebase
import firebase from 'firebase/compat/app';
import { auth, db } from '../config/Firebase';

const LearnMore = ({ navigation }) => { {
     // state variables
     const [placeholder, setPlaceholder] = useState('Search for a condition..');
     const [id, setId] = useState('');
     const [name, setName] = useState();
     const [description, setDescription] = useState();
     const [symptoms, setSymptoms] = useState();
     const [treatment, setTreatment] = useState();
     
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

    // check if the user has selected a condition
    // return information if they have, otherwise return an empty view
    const displayConditions = () => {
        if(id !== '') {
            return (
                <View style={styles.content_container}>
                    <Text style={styles.title}>Name:</Text>
                    <Text style={styles.text}>{name}</Text>
                    <Text style={styles.title}>Description:</Text>
                    <Text style={styles.text}>{description}</Text>
                    <Text style={styles.title}>Symptoms:</Text>
                    <Text style={styles.text}>{symptoms}</Text>
                    <Text style={styles.title}>Treatment:</Text>
                    <Text style={styles.text}>{treatment}</Text>
                </View>
            )
        } else {
            return (
                <View/>
            )
        }
    }

    return(
        <View style={styles.container}>
            <SearchableDropdown
                onTextChange={(text) => console.log(text)}
                onItemSelect={(item) => handleConditionChange(item)}
                //suggestion container style
                containerStyle={{ padding: 5 }}
                //inserted text style
                textInputStyle={{ padding: 12, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#FAFAFA'}}
                itemStyle={{ padding: 10, marginTop: 2, backgroundColor: '#F5F5F5', borderColor: '#bbb', borderWidth: 1,}}
                itemTextStyle={{ color: '#222',}}
                //items container style you can pass maxHeight
                itemsContainerStyle={{ maxHeight: '60%'}}
                //mapping of item array (conditions)
                items={items}
                //place holder for the search input
                placeholder={placeholder}
                placeholderTextColor="#000"
                //reset textInput Value with true and false state
                resetValue={false}
                //To remove the underline from the android input
                underlineColorAndroid="transparent"
            />
            {displayConditions()}
        </View>
    )
}};

export default LearnMore;

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1
    },
    content_container: {
        margin: 10,
        flex: 1,
    },
    title: {
        fontWeight: '500',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 5,
    },
    text: {
        fontSize: 15,
        marginBottom: 10
    }
});