import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { Button, TextInput, Portal, Provider, Modal } from 'react-native-paper';
import { colors, shadow, sizes, spacing } from '../theme';
import types from '../../lists/types';
import visibilityCategories from '../../lists/visibilityCategories';
import Slider from '@react-native-community/slider';

const PostArticle = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('');
  const [university, setUniversity] = useState('Georgia Tech'); // Default or selection
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState(1);
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [articleImageUrl, setArticleImageUrl] = useState('');


  const handlePostArticle = async () => {
    setLoading(true);

    let missingFields = [];
    if (!title.trim()) missingFields.push("Title");
    if (!description.trim()) missingFields.push("Description");
    if (!type.trim()) missingFields.push("Type");

    if (missingFields.length > 0) {
        Alert.alert('Missing Information', 'Please fill in all the required fields:\n\n ' + missingFields.join('\n\n '));
        setLoading(false);
        return;
    }

    const articleData = {
        title,
        articleDescription: description,
        department: 'Robotics',
        type,
        university: 'Georgia Tech',
        category: 'Breakthrough',
        brightmindid: 101,
        visibility,
        duration: 5,
    };

    try {
        const response = await fetch('http://yourbackendurl/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(articleData),
        });

        if (!response.ok) throw new Error('Failed to post article');

        Alert.alert('Success', 'Article posted successfully!');
        navigation.navigate('Home');
    } catch (error) {
        Alert.alert('Error', error.message);
    } finally {
        setLoading(false);
    }
};

return (
  <ScrollView style={styles.container}>
      {loading && (
          <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      )}
      <View style={styles.content}>
          <Text style={styles.heading}>Post an Article</Text>
          <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
          />
          <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              mode="outlined"
              style={[styles.input, styles.multilineInput]}
          />
          <Button
              icon="menu-down"
              mode="outlined"
              onPress={() => setTypeModalVisible(true)}
              style={styles.dropdownButton}
              contentStyle={styles.dropdownContent}
              labelStyle={styles.dropdownLabel}
          >
              {type || "Select Type"}
          </Button>
          <Portal>
            <Modal visible={isTypeModalVisible} onDismiss={() => setTypeModalVisible(false)} contentContainerStyle={styles.modalContainer}>
              {types.map((item, index) => (
                <Button 
                  key={index} 
                  onPress={() => { setType(item); setTypeModalVisible(false); }}
                  style={styles.modalItem}
                  labelStyle={styles.modalItemLabel}
                >
                  {item}
                </Button>
              ))}
            </Modal>
          </Portal>
          <Text style={styles.visibilityLabel}>{visibilityCategories[visibility - 1].label}</Text>
          <Slider
            style={{ width: '100%', height: 20 }}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={visibility}
            onValueChange={(value) => setVisibility(value)}
            thumbTintColor={colors.darkblue}
            minimumTrackTintColor={colors.darkblue}
            maximumTrackTintColor={colors.lightblue}
          />          
          <TouchableOpacity style={styles.sendButton} onPress={handlePostArticle} disabled={loading}>
            <Text style={styles.sendButtonText}>POST</Text>
          </TouchableOpacity>
      </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
  // Add your existing styles here, or adapt as needed for the article screen
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: sizes.title,
    color: colors.black,
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    borderRadius: sizes.radius,
    width:"80%",
    marginLeft: "10%",
    marginTop: spacing.m,
  },
  sendButtonText: {
    fontSize: sizes.h2,
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: spacing.m,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  visibilityLabel: {
    fontSize: sizes.h3,
    textAlign: 'center',
    marginTop: spacing.l,
    color: colors.darkblue,
    fontFamily: 'Montserrat',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: sizes.radius,
    marginBottom: spacing.s,
  },
  dropdownButton: {
    marginTop: spacing.m,
    backgroundColor: colors.darkblue,
    borderColor: colors.black,
    justifyContent: 'center',
  },
  dropdownContent: {
    height: 60,
  },
  dropdownLabel: {
    color: colors.white,
    fontSize: sizes.h3,
    fontFamily: 'Montserrat',
  },
});

export default PostArticle;
