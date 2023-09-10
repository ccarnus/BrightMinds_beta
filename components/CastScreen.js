import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel'; 

const categories = [
  { name: 'Robotics', image: require('../assets/Cast_screen_icons/Robotics.png'), color: '#FF8C00', notification: 2 },
  { name: 'AI', image: require('../assets/Cast_screen_icons/AI.png'), color: '#228B22', notification: 1 },
  { name: 'Medicine', image: require('../assets/Cast_screen_icons/Medicine.png'), color: '#4682B4', notification: 0 }
];

const CastScreen = () => {
  const navigation = useNavigation();
  const [castData, setCastData] = useState([]);

  useEffect(() => {
    // Fetch cast data from the API
    fetch('http://3.17.219.54/cast')
      .then((response) => response.json())
      .then((data) => {
        const watchList = data.map((cast, index) => ({
          id: index + 1,
          image: cast.casturl,
          title: cast.title,
        }));
        setCastData(watchList);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {categories.map((category) => (
          <View key={category.name} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Image source={category.image} style={styles.categoryImage} />
            <Text style={[styles.categoryTitle, { color: category.color }]}>{category.name}</Text>
          </View>
          <Carousel list={castData} />
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
