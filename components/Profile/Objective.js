import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, shadow, sizes, spacing } from '../theme';

const ObjectiveScreen = () => {
  const buttons = ['Follower', 'Explorer', 'Deep Learner', 'Researcher', 'Career'];
  const route = useRoute();
  const objective = route.params?.objective;

  const handleIconPress = (buttonName) => {
    Alert.alert(`Button Name`, `${buttonName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Learning Pathway</Text>
      {buttons.map((buttonName) => (
        <View key={buttonName} style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, objective === buttonName && styles.highlightedButton]}
            onPress={() => console.log(`${buttonName} button pressed`)}
          >
            <Text style={styles.buttonText}>{buttonName}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={() => handleIconPress(buttonName)}
          >
            <Image
              source={require('../../assets/Profile_icons/info_icon.png')}
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    marginBottom: spacing.l*2,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  button: {
    backgroundColor: colors.darkblue,
    padding: 15,
    borderRadius: sizes.radius,
    width: width*0.6
  },
  highlightedButton: {
    backgroundColor: colors.green,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
  },
  iconContainer: {
    padding: 10,
  },
  infoIcon: {
    width: 30,
    height: 30,
  },
});

export default ObjectiveScreen;
