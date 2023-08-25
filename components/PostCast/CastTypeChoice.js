import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CastTypeChoice = ({ navigation }) => {
  const handleChoice = (castType) => {
    switch (castType) {
      case 'Podcast':
        // Navigate to Podcast screen
        break;
      case 'Clip':
        // Navigate to Clip screen
        break;
      case 'Article':
        // Navigate to Article screen
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleChoice('Podcast')}
      >
        <Image source={require('../../assets/Post_cast_icons/podcast.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Podcast</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
            onPress={() => handleChoice('Clip')}>
        <Image source={require('../../assets/Post_cast_icons/clip.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Clip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleChoice('Article')}
      >
        <Image source={require('../../assets/Post_cast_icons/article.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Article</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  button: {
    width: '80%',
    padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
  },
  buttonText: {
    fontSize: 32,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
});

export default CastTypeChoice;
