import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel';
import { RefreshControl } from 'react-native';


const CastScreen = () => {
  const navigation = useNavigation();
  const [SuggestedCastData, setSuggestedCastData] = useState([]);
  const [TrendingCastData, setTrendingCastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const USER_ID = "6474e4001eec5ee1ecd40180";
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSuggestedCastData();
    fetchTrendingCastData();
    setRefreshing(false);
  }, []);

  const fetchSuggestedCastData = () => {
    const endpoint_suggested_for_you = `http://3.17.219.54/user/${USER_ID}/suggested/for/you`;
    setIsLoading(true);

    fetch(endpoint_suggested_for_you)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((cast, index) => ({
          id: cast._id,
          image: cast.castimageurl,
          title: cast.title,
        }));
        setSuggestedCastData(formattedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchTrendingCastData = () => {
    const endpoint_suggested_for_you = `http://3.17.219.54/cast/trending/right/now`;
    setIsLoading(true);

    fetch(endpoint_suggested_for_you)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((cast, index) => ({
          id: cast._id,
          image: cast.castimageurl,
          title: cast.title,
        }));
        setTrendingCastData(formattedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSuggestedCastData();
    fetchTrendingCastData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="large" color={colors.black} />
        </View>
      ) : (
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
          <TouchableOpacity style={styles.SuffleButton} onPress={() => navigation.navigate('Watch')}>
            <Text style={styles.SuffleButtonText}>Follow the Bear</Text>
          </TouchableOpacity>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Suggested for you</Text>
          </View>
          <Carousel list={SuggestedCastData} carouselType="suggested" />
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Trending</Text>
          </View>
          <Carousel list={TrendingCastData} carouselType="trending" />
        </ScrollView>
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('CastTypeChoice')}>
        <Image 
          source={require('../assets/Cast_screen_icons/plus_icon.png')} 
          style={styles.imageIcon} 
        />
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
    marginLeft: spacing.s,
  },
  categoryTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    backgroundColor: 'transparent', // Set the background to transparent
  },
  imageIcon: {
    width: '100%',  // Fill the entire space of the button
    height: '100%',
    resizeMode: 'contain', // Ensure the image is scaled correctly
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
  },
  SuffleButton: {
    padding: 15,
    backgroundColor: colors.black,
    borderRadius: 5,
    alignItems: 'center',
    borderRadius: sizes.radius,
    width:"80%",
    marginLeft: "10%",
  },
  SuffleButtonText: {
    fontSize: sizes.h2,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default CastScreen;
