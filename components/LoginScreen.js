import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { Button, TextInput, Portal, Provider, Modal } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, sizes, spacing } from './theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMessage, setCustomAlertMessage] = useState("");

  const showCustomAlert = (message) => {
    setCustomAlertMessage(message);
    setCustomAlertVisible(true);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://3.17.219.54/user/login', { email, password });
      const userId = response.data.userId;
      await AsyncStorage.setItem('userId', userId);

      // Fetch user details to get the role
      const userDetailsResponse = await axios.get(`http://3.17.219.54/user/${userId}`);
      const userRole = userDetailsResponse.data.role;
      await AsyncStorage.setItem('userRole', userRole);

      navigation.navigate('BottomNav');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid credentials';
      showCustomAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/BrightMinds_research_icon.png')} style={styles.titleImage} resizeMode="contain" />
          <Text style={styles.title}>Login</Text>
          <TextInput
            label="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
          />
          <TextInput
            label="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
          />
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading} 
            style={styles.button} 
            disabled={!email || !password}
          >
            Login
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
          <Portal>
            <Modal visible={customAlertVisible} onDismiss={() => setCustomAlertVisible(false)} contentContainerStyle={styles.modalContainer}>
              <Text>{customAlertMessage}</Text>
              <Button onPress={() => setCustomAlertVisible(false)}>OK</Button>
            </Modal>
          </Portal>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primaryBis,
  },
  titleImage: {
    width: "100%",
    height: 150,
    marginBottom: spacing.xl,
    marginTop: spacing.l,
  },
  title: {
    fontSize: sizes.title,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.secondary,
    fontFamily: 'MontserratBold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
    fontFamily: 'Montserrat',
  },
  button: {
    backgroundColor: colors.secondary,
    marginTop: 20,
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.secondary,
    fontFamily: 'Montserrat',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: sizes.radius,
  },
});

export default LoginScreen;
