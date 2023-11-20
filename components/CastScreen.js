import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
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
  const [allCasts, setAllCasts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSuggestedCastData();
    fetchTrendingCastData();
    fetchAllCastData();
    setRefreshing(false);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    const filteredCasts = allCasts.filter((cast) =>
      cast.title.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredCasts);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchResultPress = (id) => {
    navigation.navigate('SearchResult', { selectedCastId: id });
  };

  const fetchAllCastData = async () => {
    try {
      const response = await fetch('http://3.17.219.54/cast');
      const data = await response.json();
      setAllCasts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuggestedCastData = () => {
    const endpoint_suggested_for_you = `http://3.17.219.54/user/${USER_ID}/suggested/for/you`;
    setIsLoading(true);

    fetch(endpoint_suggested_for_you)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((cast) => ({
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
        const formattedData = data.map((cast) => ({
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
    fetchAllCastData();
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
          <TextInput
            style={styles.searchBar}
            placeholder="Search casts..."
            onChangeText={(text) => handleSearch(text)}
          />
          {searchResults.length > 0 ? (
            searchResults.map((cast) => (
              <TouchableOpacity key={cast._id} onPress={() => handleSearchResultPress(cast._id)}>
                <Text style={styles.searchResultItem}>{cast.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>Suggested for you</Text>
              </View>
              <Carousel list={SuggestedCastData} carouselType="suggested" />
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>Trending</Text>
              </View>
              <Carousel list={TrendingCastData} carouselType="trending" />
            </>
          )}
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
    backgroundColor: 'transparent',
  },
  imageIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
  },
  searchBar: {
    padding: 10,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: sizes.radius,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default CastScreen;