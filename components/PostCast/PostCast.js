import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const PostCast = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('');
  const [brightmindid, setBrightmindid] = useState('');
  const [university, setUniversity] = useState('');
  const [category, setCategory] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState(null);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
      });
      if (!result.canceled && result.uri) {
        setVideo(result);
        setThumbnailUri(result.uri); // Set thumbnailUri here
      }
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };  

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
      brightmindid,
      university,
      category,
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
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />
        <Text style={styles.fieldDescription}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="Type"
          value={type}
          onChangeText={setType}
        />
        <Text style={styles.fieldDescription}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="University"
          value={university}
          onChangeText={setUniversity}
        />
        <Text style={styles.fieldDescription}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="Brightmind ID"
          value={brightmindid}
          onChangeText={setBrightmindid}
        />
        <Text style={styles.fieldDescription}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
        ) : (
          <ActivityIndicator size="large" color="#3498db" style={styles.loadingThumbnail} />
        )}
        <View style={styles.videoPicker}>
          <TouchableOpacity style={styles.videoButton} onPress={takeNewVideo}>
            <Text style={styles.videoButtonText}>Take a New Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoButton} onPress={pickVideo}>
            <Text style={styles.videoButtonText}>Choose from Existing</Text>
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
    fontSize: 16,
    color: '#1c1c1c',
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  videoButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  selectedVideo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
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
