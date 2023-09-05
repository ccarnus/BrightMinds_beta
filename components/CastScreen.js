import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel';

const categories = [
  { name: 'Robotics', image: require('../assets/Cast_screen_icons/Robotics.png'), color: '#FF8C00', notification: 2 },
  { name: 'AI', image: require('../assets/Cast_screen_icons/AI.png'), color: '#228B22', notification: 1 },
  { name: 'Medicine', image: require('../assets/Cast_screen_icons/Medicine.png'), color: '#4682B4', notification: 0 },
  { name: 'Economics', image: require('../assets/Cast_screen_icons/Economic.png'), color: '#8A2BE2', notification: 0 },
  { name: 'Electronics', image: require('../assets/Cast_screen_icons/Electronics.png'), color: '#DC143C', notification: 0 },
  { name: 'Computer Science', image: require('../assets/Cast_screen_icons/Computer_science.png'), color: '#20B2AA', notification: 0 },
  { name: 'Aerospace', image: require('../assets/Cast_screen_icons/Aerospace.png'), color: '#556B2F', notification: 1 },
  { name: 'Biology', image: require('../assets/Cast_screen_icons/Biology.png'), color: '#800000', notification: 0 },
  { name: 'Chemistry', image: require('../assets/Cast_screen_icons/Chemistry.png'), color: '#2F4F4F', notification: 0 },
  { name: 'Physics', image: require('../assets/Cast_screen_icons/Physics.png'), color: '#4B0082', notification: 0 },
];

const Watch = [
  {
    id: 1,
    image: require('../assets/Cast_icons/Watch/download.jpg'),
    title: 'Granada',
    location: 'Spain',
    description:
      'Granada is the capital city of the province of Granada, in the autonomous community of Andalusia, Spain',
  },
  {
    id: 2,
    image: require('../assets/Cast_icons/Watch/toto.jpg'),
    title: 'Cherry blossoms',
    location: 'Japan',
    description:
      "Cherry blossoms usually bloom between mid-March and early May. In 2022, Tokyo's cherry blossom season officially began on March 20",
  },
    {
      id: 3,
      image: require('../assets/Cast_icons/Watch/img1.png'),
      title: 'Amalfi',
      location: 'Italy',
      description:
        'The ultimate Amalfi Coast travel guide, where to stay, where to eat, and what areas to visit in the Amalfi Coast of Italy. Positano, Ravello, Amalfi and more',
    },
    {
      id: 4,
      image: require('../assets/Cast_icons/Watch/download.jpg'),
      title: 'Granada',
      location: 'Spain',
      description:
        'Granada is the capital city of the province of Granada, in the autonomous community of Andalusia, Spain',
    },
    {
      id: 5,
      image: require('../assets/Cast_icons/Watch/toto.jpg'),
      title: 'Cherry blossoms',
      location: 'Japan',
      description:
        "Cherry blossoms usually bloom between mid-March and early May. In 2022, Tokyo's cherry blossom season officially began on March 20",
    },
  ];

const CastScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {categories.map((category) => (
          <View key={category.name} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Image source={category.image} style={styles.categoryImage} />
            <Text style={[styles.categoryTitle, { color: category.color }]}>{category.name}</Text>
          </View>
          <Carousel list={Watch} />
        </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('CastTypeChoice')}>
        <MaterialCommunityIcons name="plus" size={32} color='#f1f1f1' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  categoryContainer: {
    marginVertical: 10,
    paddingHorizontal: spacing.m,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  categoryTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  categoryImage: {
    width: 24,
    height: 24,
    marginRight: spacing.s,
    marginBottom: spacing.s-2,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    backgroundColor: colors.black,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default CastScreen;
