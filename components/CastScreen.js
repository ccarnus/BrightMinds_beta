import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel';

const CastScreen = () => {
  const navigation = useNavigation();
  const [castData, setCastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const USER_ID = "6474e4001eec5ee1ecd40180";

  const fetchCastData = () => {
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
        setCastData(formattedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCastData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="large" color={colors.black} />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <TouchableOpacity 
            style={styles.roundButton}
            onPress={() => navigation.navigate('Watch')}>
              <Image source={require('../assets/Cast_screen_icons/random_icon.png')} 
              style={styles.roundButtonImage} />
          </TouchableOpacity>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Suggested for you</Text>
          </View>
          <Carousel list={castData} />
        </ScrollView>
      )}
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
});

export default CastScreen;
