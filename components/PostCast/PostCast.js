import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';
import universities from '../../lists/universities';
import types from '../../lists/types';
import departments from '../../lists/departments';
import {colors, shadow, sizes, spacing} from '../theme';
import Slider from '@react-native-community/slider';
import visibilityCategories from '../../lists/visibilityCategories';
import { TextInput, Dropdown } from 'react-native-paper';

const PostCast = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('');
  const [university, setUniversity] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [visibility, setVisibility] = useState(1);

  const takeNewVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setVideo(result.assets[0]);
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking new video:', error);
    }
  };

  const sendCast = async () => {
    setLoading(true);
    const castData = {
      title,
      description,
      department,
      type,
      university,
      category: 'Breakthrough',
      brightmindid: '101',
      castimageurl: 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png',
      visibility,
    };

    const formData = new FormData();
    formData.append('cast', JSON.stringify(castData));
    if (video) {
      formData.append('video', {
        uri: video.uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });
    }

    try {
      const response = await fetch('http://3.17.219.54/cast', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(formData);

      if (response.ok) {
        Alert.alert('Success', 'Cast posted successfully!');
        navigation.navigate('Cast');
      } else {
        Alert.alert('Error', 'Failed to post cast.');
      }
    } catch (error) {
      console.error('Error sending cast:', error);
      Alert.alert('Error', 'An error occurred while sending the cast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.heading}>Post a Cast</Text>
        <TextInput
          label="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          mode="outlined"
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
        />
        <Text style={styles.fieldDescription}>Department</Text>
        <Picker
          selectedValue={department}
          style={styles.picker}
          onValueChange={(itemValue) => setDepartment(itemValue)}
        >
          {departments.map((dep, index) => (
            <Picker.Item key={index} label={dep.name} value={dep.name}>
            </Picker.Item>
          ))}
        </Picker>
        <Text style={styles.fieldDescription}>Type</Text>
        
        <Picker
          selectedValue={type}
          style={styles.input}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          {types.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
          </Picker>

        <Text style={styles.fieldDescription}>University</Text>
        <Picker
          selectedValue={university}
          style={styles.input}
          onValueChange={(itemValue) => setUniversity(itemValue)}
        >
          {universities.map((univ, index) => (
            <Picker.Item key={index} label={univ} value={univ} />
          ))}
        </Picker>
        <Text style={styles.fieldDescription}>Visibility</Text>
        <Text style={styles.visibilityLabel}>{visibilityCategories[visibility - 1].label}</Text>
        <Slider
          style={{ width: '100%', height: 20,  }}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={visibility}
          onValueChange={(value) => setVisibility(value)}
          thumbTintColor={colors.darkblue}
          minimumTrackTintColor={colors.darkblue}
          maximumTrackTintColor={colors.lightblue}
        />
        <View style={styles.thumbnailContainer}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
          ) : (
            <ActivityIndicator size="large" color="#3498db" style={styles.loadingThumbnail} />
          )}
        </View>
        <View style={styles.videoPicker}>
          <TouchableOpacity style={styles.videoButton} onPress={takeNewVideo}>
            <Text style={styles.videoButtonText}>FILM</Text>
          </TouchableOpacity>
        </View >
        <View style={styles.videoPicker}>
          <TouchableOpacity style={styles.sendButton} onPress={sendCast} disabled={loading}>
            <Text style={styles.sendButtonText}>POST</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% transparent black background
    zIndex: 1000, // Ensure the overlay is on top
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker overlay for the loading container
  },
  content: {
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginBottom: 20,
  },
  fieldDescription: {
    fontSize: sizes.h2,
    color: '#1c1c1c',
    marginBottom: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  videoPicker: {
    marginBottom: 15,
    width: "100%",

  },
  videoButton: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    borderColor: colors.black,
    borderWidth: 1,
    width:"80%",
    marginLeft: "10%",
  },
  videoButtonText: {
    fontSize: sizes.h2,
    color: colors.black,
    textAlign: 'center',
  },
  sendButton: {
    padding: 15,
    backgroundColor: colors.black,
    borderRadius: 5,
    alignItems: 'center',
    borderRadius: sizes.radius,
    width:"80%",
    marginLeft: "10%",
  },
  sendButtonText: {
    fontSize: sizes.h2,
    color: colors.white,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 150,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  loadingThumbnail: {
    height: 100,
    marginTop:10,
    marginBottom: 10,
  },
  visibilityLabel: {
    fontSize: sizes.h3,
    textAlign: 'center',
    marginVertical: 10,
    color: colors.darkblue,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
    
  },
  picker: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  departmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  departmentImage: {
    width: 30, // Adjust the size as needed
    height: 30, // Adjust the size as needed
    marginRight: 10,
  },
  departmentName: {
    fontSize: sizes.h2,
  },
});

export default PostCast;
