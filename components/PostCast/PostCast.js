import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';
import { Video } from 'expo-av';
import universities from '../../lists/universities';
import types from '../../lists/types';
import departments from '../../lists/departments';
import {colors, shadow, sizes, spacing} from '../theme';

const PostCast = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('');
  const [university, setUniversity] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState(null);

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

      if (response.ok) {
        Alert.alert('Success', 'Cast posted successfully!');
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
        <Text style={styles.fieldDescription}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.fieldDescription}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.fieldDescription}>Department</Text>
        <Picker
          selectedValue={department}
          style={styles.input}
          onValueChange={(itemValue) => setDepartment(itemValue)}
        >
          {departments.map((dep, index) => (
            <Picker.Item key={index} label={dep} value={dep} />
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
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
        ) : (
          <ActivityIndicator size="large" color="#3498db" style={styles.loadingThumbnail} />
        )}
        <View style={styles.videoPicker}>
          <TouchableOpacity style={styles.videoButton} onPress={takeNewVideo}>
            <Text style={styles.videoButtonText}>Film Cast</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendCast} disabled={loading}>
        <Text style={styles.sendButtonText}>Send Cast</Text>
      </TouchableOpacity>
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
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor:  colors.lightGray,
    borderRadius: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  videoPicker: {
    marginBottom: 15,
  },
  videoButton: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: colors.black,
    borderRadius: 5,
    borderRadius: sizes.radius,
  },
  videoButtonText: {
    fontSize: sizes.h2,
    color: colors.white,
    textAlign: 'center',
  },
  sendButton: {
    padding: 15,
    backgroundColor: colors.black,
    borderRadius: 5,
    alignItems: 'center',
    borderRadius: sizes.radius,
  },
  sendButtonText: {
    fontSize: sizes.h2,
    color: colors.white,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  loadingThumbnail: {
    width: 100,
    height: 100,
    marginBottom: 10,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
});

export default PostCast;
