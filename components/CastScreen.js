import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel';
import ArticleCarousel from './Cast/ArticleCarousel';
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
  const forYou = require('../assets/Cast_screen_icons/foryou_icon.png');
  const trendingIcon = require('../assets/Cast_screen_icons/trending_icon.png');
  const articleIcon = require('../assets/Cast_screen_icons/article_logo.png');
  const discoverIcon = require('../assets/Bottom_icons/discover.png');
  const podcastIcon = require('../assets/Cast_screen_icons/podcast_logo.png');
  const [articleData, setArticleData] = useState([]);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSuggestedCastData();
    fetchTrendingCastData();
    fetchAllCastData();
    fetchArticleData();
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

  const navigateToDiscoverScreen = () => {
    navigation.navigate('DiscoverScreen');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchResultPress = (id) => {
    navigation.navigate('SearchResult', { selectedCastId: id });
    console.log(id)
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

  const fetchArticleData = async () => {
    try {
      const response = await fetch('http://3.17.219.54/article');
      const data = await response.json();
      setArticleData(data);
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
          duration: cast.duration,
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
          duration: cast.duration,
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
    fetchArticleData(); 
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="large" color={colors.white} />
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
          <View style={styles.searchAndDiscoverContainer}>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search casts..."
                onChangeText={handleSearch}
                placeholderTextColor={colors.white}
                value={searchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={navigateToDiscoverScreen} style={styles.discoverButton}>
              <Image source={discoverIcon} style={styles.discoverIcon} />
            </TouchableOpacity>
          </View>
          {searchResults.length > 0 ? (
            searchResults.map((cast) => (
              <TouchableOpacity key={cast._id} onPress={() => handleSearchResultPress(cast._id)}>
                <Text style={styles.searchResultItem}>{cast.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <>
              <View style={styles.categoryHeader}>
                <Image source={forYou} style={styles.categoryIcon} />
                <Text style={styles.categoryTitle}>For you</Text>
              </View>
              <Carousel list={SuggestedCastData} carouselType="suggested" />
              <View style={styles.categoryHeader}>
                <Image source={trendingIcon} style={styles.categoryIcon} />
                <Text style={styles.categoryTitle}>Trending</Text>
              </View>
              <Carousel list={TrendingCastData} carouselType="trending" />
              <View style={styles.categoryHeader}>
              <Image source={articleIcon} style={styles.categoryIcon} />
                <Text style={styles.categoryTitle}>Articles</Text>
              </View>
              <ArticleCarousel list={articleData} />
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
    backgroundColor: colors.darkblue,
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
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkblue,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: sizes.radius,
    marginRight: spacing.s,
    marginLeft: spacing.xs,
    height: 50,
  },
  discoverButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
  },
  discoverIcon: {
    width: 35,
    height: 35,
  },
  searchAndDiscoverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
  },
  searchBar: {
    marginLeft: spacing.s,
  },
  clearButton: {
    marginLeft: 10,
  },
  clearButtonText: {
    color: colors.white,
    fontSize: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    marginTop: spacing.l,
    marginLeft: spacing.s,
  },
  categoryTitle: {
    fontSize: sizes.h2,
    color: colors.white,
    fontFamily: 'MontserratBold',
  },
  categoryIcon: {
    width: 28,
    height: 28,
    marginRight: spacing.s,
  },
});

export default CastScreen;