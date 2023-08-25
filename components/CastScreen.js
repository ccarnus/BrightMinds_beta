import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

const CastScreen = () => {
  const navigation = useNavigation();

  const handleCatchUpPress = () => {
    navigation.navigate('CatchUpScreen'); 
  };

  const handlePostCastPress = () => {
    navigation.navigate('PostCast'); 
  };

  const numRows = Math.ceil(categories.length / 2);
  const categoryRows = Array.from({ length: numRows }, (_, rowIndex) =>
    categories.slice(rowIndex * 2, rowIndex * 2 + 2)
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.catchUpButton} onPress={handleCatchUpPress}>
        <Text style={styles.buttonText}>Catch Up</Text>
      </TouchableOpacity>

      <ScrollView style={styles.categoryButtons}>
  {categoryRows.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {row.map(category => (
        <TouchableOpacity
          key={category.name}
          style={[styles.categoryButton, { backgroundColor: category.color }]}
        >
          {category.notification > 0 && (
            <View style={styles.notificationContainer}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color="#FFD700"
                style={styles.notificationIcon}
              />
              <Text style={styles.notificationText}>{category.notification}</Text>
            </View>
          )}
          <Image source={category.image} style={styles.categoryImage} />
        {/*<Text style={styles.categoryButtonText}>{category.name}</Text>*/}
        </TouchableOpacity>
      ))}
    </View>
  ))}
</ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={handlePostCastPress}>
        <MaterialCommunityIcons name="plus" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  catchUpButton: {
    backgroundColor: '#1c1c1c',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryButtons: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    opacity:0.9,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 2,
  },
  notificationText: {
    color: '#FFD700',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  categoryImage: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
});

export default CastScreen;
