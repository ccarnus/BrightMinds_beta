import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Svg, Circle, Image as SvgImage } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel';

const Tab = createMaterialTopTabNavigator();

const CastWatchingTimeTab = () => {
  const navigation = useNavigation();

  const handleReadyScreenPress = () => {
    navigation.navigate('Ready');
  };

  const castWatchGoal = 0.7; // Goal for Cast Watching Time
  const [castWatchProgress, setCastWatchProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();

    const animateCastWatch = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const divisor = 1000; // Adjust this value for slower/faster animation

      const progress = Math.min(deltaTime / divisor, 1);

      setCastWatchProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCastWatch);
      }
    };

    animateCastWatch();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.categoryContainer}>
        <View style={styles.buttonEvaluationContainer}>
          <TouchableOpacity style={styles.buttonStartWeeklyEvaluation} onPress={handleReadyScreenPress}>
            <Text style={styles.buttonText}>Start Weekly Evaluation</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
          <Svg width={60} height={60}>
            <Circle
              cx={30}
              cy={30}
              r={27}
              stroke={colors.lightGray}
              strokeWidth={6}
              fill="none"
            />
            <Circle
              cx={30}
              cy={30}
              r={27}
              stroke={colors.darkblue}
              strokeWidth={6}
              fill="none"
              strokeDasharray="162"
              strokeDashoffset={162 * (1 - Math.min(castWatchProgress, castWatchGoal))}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
            <SvgImage
              x={12}
              y={12}
              width={36}
              height={36}
              href={require('../assets/Track_icons/clock.png')}
            />
          </Svg>
        </View>
        <Text style={styles.WatchTimeText}>05:56:24 (6hr limit)</Text>
      </View>
    </View>
  );
};

const TrackProgressTab = () => {

  const Gauge = ({ progress }) => {
    return (
      <View style={styles.objectiveProgressGaugeContainer}>
        <ProgressBar progress={progress} color={colors.darkblue} style={styles.objectiveProgressProgressBar} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.objectiveProgressTitle}>Your Overall Progress</Text>
      <Gauge progress={0.7} />
    </View>
  );
};

const BookmarkedTab = () => {
  const [castData, setCastData] = useState({});
  const userId = '6474e4001eec5ee1ecd40180';

  useEffect(() => {
    const userEndpoint = `http://3.17.219.54/user/bookmarks/${userId}`;

    fetch(userEndpoint)
      .then((response) => response.json())
      .then((userData) => {
        const castIds = userData.map((bookmarks) => bookmarks.castId);

        // Fetch cast data for each cast ID
        const castDataPromises = castIds.map((castId) => {
          const castEndpoint = `http://3.17.219.54/cast/${castId}`;
          return fetch(castEndpoint).then((response) => response.json());
        });

        // Wait for all cast data to be fetched
        Promise.all(castDataPromises)
          .then((castDataList) => {
            // Now, castDataList contains data for all the casts
            const castList = castDataList.map((cast) => ({
              id: cast._id,
              image: cast.castimageurl,
              title: cast.title,
              // You can add more fields from the cast JSON as needed
            }));
            setCastData(castList);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView>
        <View style={styles.bookmarkedCategory}>
          <Text style={styles.bookmarkedCategoryTitle}>Bookmarked</Text>
        </View>
        <Carousel list={castData || []} />
        <View style={styles.bookmarkedCategory}>
          <Text style={styles.bookmarkedCategoryTitle}>Shared with me</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const TrackScreen = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: { fontSize: 0},
        tabStyle: { width: 120 },
        style: { backgroundColor: colors.white },
        indicatorStyle: { backgroundColor: colors.black },
      }}
    >
      <Tab.Screen name="CastWatchingTimeTab" component={CastWatchingTimeTab} options={{ tabBarIcon: () => (
        <Image source={require('../assets/Track_icons/brain_clock_icon.png')} style={styles.tabIcon} />
      ) }} />
      <Tab.Screen name="TrackProgressTab" component={TrackProgressTab} options={{ tabBarIcon: () => (
        <Image source={require('../assets/Track_icons/track_icon.png')} style={styles.tabIcon} />
      ) }} />
      <Tab.Screen name="BookmarkedTab" component={BookmarkedTab} options={{ tabBarIcon: () => (
        <Image source={require('../assets/Track_icons/bookmark_icon.png')} style={styles.tabIcon} />
      ) }} />
    </Tab.Navigator>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
  },
  categoryContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonEvaluationContainer: {
    marginTop: spacing.l*2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:spacing.l,
  },
  valueText: {
    marginTop:spacing.l,
    fontSize: sizes.h2,
    color: '#1c1c1c',
  },
  buttonStartWeeklyEvaluation: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: colors.black,
    borderRadius: sizes.radius,
    borderWidth: 2,
  },
  buttonText: {
    color: colors.black,
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
  fieldContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  progressBar: {
    width: windowWidth - 100,
    height: sizes.gauge,
    borderRadius: 15,
  },
  WatchTimeText: {
    color: '#1c1c1c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  bookmarkedCategory: {
    marginBottom: spacing.m,
    marginTop: spacing.m,
    marginLeft: spacing.s,
  },
  bookmarkedCategoryTitle: {
    fontSize: sizes.title,
    color: colors.black,
  },
  objectiveProgressTitle: {
    fontSize: sizes.h2,
    color: colors.black,
    marginBottom: spacing.m,
    marginTop: spacing.m,
    marginLeft: spacing.s,
  },
  objectiveProgressGaugeContainer: {
    width: '100%',
    padding: 5,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
  },
  objectiveProgressProgressBar: {
    height: 10,
    borderRadius: sizes.radius,
    overlayColor: colors.darkblue,
    backgroundColor: colors.lightGray,
  },
});

export default TrackScreen;
