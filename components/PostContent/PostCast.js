import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator, Dimensions, Modal as ModalReact} from 'react-native';
import { Button, TextInput, Portal, Provider, Modal } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import types from '../../lists/types';
import {colors, shadow, sizes, spacing} from '../theme';
import Slider from '@react-native-community/slider';
import visibilityCategories from '../../lists/visibilityCategories';

const PostCast = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [visibility, setVisibility] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMessage, setCustomAlertMessage] = useState("");

  const showCustomAlert = (message) => {
    setCustomAlertMessage(message);
    setCustomAlertVisible(true);
  };  

  const takeNewVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVideo(result.assets[0]);
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking new video:', error);
    }
  };

  //Modal button styles
  const CustomButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Function to pick a video from the gallery
  const pickVideoFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideo(result.assets[0]);
      setThumbnailUri(result.assets[0].uri);
    }
  };

  const handlePlayVideo = () => {
    navigation.navigate('VideoPlayer', { videoUri: video.uri });
  };

  const sendCast = async () => {
    let missingFields = [];
  
    if (!title.trim()) missingFields.push("Title");
    if (!description.trim()) missingFields.push("Description");
    if (!type.trim()) missingFields.push("Type");
    if (!video) missingFields.push("Video");
  
    if (missingFields.length > 0) {
      let errorMessage = 'Please fill in all the required fields:\n\n ' + missingFields.join('\n\n ');
  
      showCustomAlert(errorMessage);('Missing Information', errorMessage);
      return;
    }
  
    setLoading(true);
    const castData = {
      title,
      description,
      department: 'Robotics',
      type,
      university: 'Georgia Tech',
      category: 'Breakthrough',
      brightmindid: '101',
      visibility,
    };
  
    const formData = new FormData();
    formData.append('cast', JSON.stringify(castData));
    formData.append('video', {
      uri: video.uri,
      type: 'video/mp4',
      name: 'video.mp4',
    });
  
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
        navigation.navigate('Cast');
      } else {
        const errorData = await response.text();
        Alert.alert('Error', `Failed to post cast. Error: ${errorData}`);
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
        {video && (
          <TouchableOpacity onPress={handlePlayVideo} style={styles.thumbnailContainer}>
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>▶</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.videoPicker}>
          <TouchableOpacity onPress={toggleModal} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>Select Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={sendCast} disabled={loading}>
            <Text style={styles.sendButtonText}>POST</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalReact
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose Video Source</Text>
            <CustomButton
              title="Record Video"
              onPress={() => {
                takeNewVideo();
                toggleModal();
              }}
              style={styles.recordButton}
              textStyle={styles.recordButtonText}
            />
            <CustomButton
              title="Choose from Gallery"
              onPress={() => {
                pickVideoFromGallery();
                toggleModal();
              }}
              style={styles.galleryButton}
              textStyle={styles.galleryButtonText}
            />
            <CustomButton
              title="Cancel"
              onPress={toggleModal}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        </View>
      </ModalReact>
      <ModalReact
        visible={customAlertVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCustomAlertVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.customAlertModalView}>
            <Text style={styles.customAlertText}>{customAlertMessage}</Text>
            <Button onPress={() => setCustomAlertVisible(false)}>OK</Button>
          </View>
        </View>
      </ModalReact>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 1000, // Ensure the overlay is on top
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: sizes.title,
    color: colors.black,
    marginTop: 40,
    marginBottom: 20,
    fontFamily: 'MontserratBold',
  },
  fieldDescription: {
    fontSize: sizes.h2,
    color: '#1c1c1c',
    marginBottom: 5,
    fontFamily: 'Montserrat',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  videoPicker: {
    marginBottom: spacing.m,
    marginTop: spacing.l,
    width: "100%",

  },
  videoButton: {
    marginBottom: spacing.s,
    marginTop: spacing.s,
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
    fontFamily: 'MontserratBold',
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
  thumbnailContainer: {
    width: '70%',
    height: 200,
    marginLeft: '15%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    marginTop: spacing.l,
    borderRadius: 10,
    overflow: 'hidden', // Ensure the child components do not overflow
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent overlay
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  loadingThumbnail: {
    height: 100,
    marginTop:10,
    marginBottom: 10,
  },
  visibilityLabel: {
    fontSize: sizes.h3,
    textAlign: 'center',
    marginTop: spacing.l,
    color: colors.darkblue,
    fontFamily: 'Montserrat',
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
    width: 30,
    height: 30,
    marginRight: 10,
  },
  departmentName: {
    fontSize: sizes.h2,
    fontFamily: 'Montserrat',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: colors.black,
    fontFamily: 'Montserrat',
  },
  button: {
    borderRadius: sizes.radius,
    padding: 10,
    elevation: 2,
    width: '80%',
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontFamily: 'MontserratBold',
    textAlign: "center",
  },
  recordButton: {
    backgroundColor: colors.green,
  },
  recordButtonText: {},
  galleryButton: {
    backgroundColor: colors.lightblue,
  },
  galleryButtonText: {},
  cancelButton: {
    backgroundColor: colors.black,
  },
  cancelButtonText: {},
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: sizes.radius,
    marginBottom: spacing.s,
  },
  modalItem: {
    marginBottom: spacing.xs,
    borderColor: colors.black,
  },
  modalItemLabel: {
    color: colors.black,
    fontFamily: 'Montserrat',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  customAlertModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  customAlertText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Montserrat', // Make sure Montserrat is correctly linked
    fontSize: 16,
  },
});

export default PostCast;
