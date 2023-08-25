import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CastTypeChoice = () => {
    
    const navigation = useNavigation();

  const handleChoice = (castType) => {
    switch (castType) {
      case 'Podcast':
        // Navigate to Podcast screen
        break;
      case 'Clip':
        navigation.navigate('PostCast');
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
        <View style={styles.content}>
          <Image
            source={require('../../assets/Post_cast_icons/podcast.png')}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Podcast</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleChoice('Clip')}
      >
        <View style={styles.content}>
          <Image
            source={require('../../assets/Post_cast_icons/clip.png')}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Clip</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleChoice('Article')}
      >
        <View style={styles.content}>
          <Image
            source={require('../../assets/Post_cast_icons/article.png')}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Article</Text>
        </View>
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
    marginBottom: 30,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 32,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
});

export default CastTypeChoice;
