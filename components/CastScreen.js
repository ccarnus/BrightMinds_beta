import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
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
  const [castData, setCastData] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollViewRef = useRef(null);

  const fetchCastData = (category) => {
    // Construct the endpoint URL based on the category
    const endpoint = `http://3.17.219.54/cast/department/${category}`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        const watchList = data.map((cast, index) => ({
          id: index + 1,
          image: cast.castimageurl,
          title: cast.title,
        }));
        setCastData((prevData) => ({
          ...prevData,
          [category]: watchList, // Store data for the category using its name as the key
        }));
        console.log(castData);
        setIsRefreshing(false);
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      })
      .catch((error) => {
        console.error(error);
        setIsRefreshing(false);
      });
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);

    categories.forEach((category) => {
      fetchCastData(category.name);
    });
  }, []);

  useEffect(() => {
    // Fetch cast data from the API when the component mounts
    handleRefresh();
  }, [handleRefresh]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const scrollHeight = event.nativeEvent.contentSize.height;
          const screenHeight = event.nativeEvent.layoutMeasurement.height;

          // Check if the user has scrolled to the top (you can adjust the threshold as needed)
          if (offsetY <= -50) {
            handleRefresh(); // Trigger refresh when scrolled to the top
          }
          if (offsetY + screenHeight >= scrollHeight) {
            // Implement your logic when the user reaches the bottom
            // For example, you can load more content when the user reaches the bottom
          }
        }}
        ref={scrollViewRef}
      >
        <TouchableOpacity 
        style={styles.roundButton}
        onPress={() => navigation.navigate('Watch')}>
          <Image source={require('../assets/Cast_screen_icons/random_icon.png')} 
          style={styles.roundButtonImage} />
        </TouchableOpacity>
        {isRefreshing && (
          <View style={styles.refreshIndicator}>
            <ActivityIndicator size="small" color={colors.black} />
            <Text style={styles.refreshText}>Refreshing...</Text>
          </View>
        )}
        {categories.map((category) => (
          <View key={category.name} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={[styles.categoryTitle, { color: category.color }]}>{category.name}</Text>
            </View>
            <Carousel list={castData[category.name] || []} />
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
  scrollView: {
    flex: 1,
  },
  roundButton: {
    top: 5,
    marginBottom:5,
    left: '50%',
    marginLeft: -30,
    backgroundColor: colors.white,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderColor: colors.black,
    borderWidth: 2,
  },
  roundButtonImage: {
    width: 30,
    height: 30,
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
    marginBottom: spacing.s - 2,
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
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
  },
  refreshText: {
    marginLeft: spacing.s,
    color: colors.black,
  },
});

export default CastScreen;
