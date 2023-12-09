import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors, sizes, spacing } from './theme';
import Carousel from './Cast/Carousel';
import { VictoryPie, VictoryLabel, Point } from 'victory-native';

const USERID = "6474e4001eec5ee1ecd40180";

const Tab = createMaterialTopTabNavigator();

const CastWatchingTimeTab = () => {
  const navigation = useNavigation();

  const handleReadyScreenPress = () => {
    navigation.navigate('Ready');
  };

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.categoryContainer}>
        <View style={styles.buttonEvaluationContainer}>
          <TouchableOpacity style={styles.buttonStartWeeklyEvaluation} onPress={handleReadyScreenPress}>
            <Text style={styles.buttonText}>Take Test</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.WatchTimeText}>05:56:24 (6hr limit)</Text>
      </View>
      <View style={styles.metricsContainersContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.metricsContainer}>
            <Text style={styles.metricsData}>72%</Text>
            <Text style={styles.metricsTitle}>Succes Rate</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.metricsContainer}>
            <Text style={styles.metricsData}>38</Text>
            < Text style={styles.metricsTitle}>Tests Taken</Text>
          </View>
        </View>
      </View>
      <View style={styles.metricsContainersContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.metricsContainer}>
            <Text style={styles.metricsData}>29</Text>
            <Text style={styles.metricsTitle}>Topics Learnt</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.metricsContainer}>
            <View style={styles.streakImageContainer}>
              <Text style={styles.metricsData}>5</Text>
              <Image
                  source={require('../assets/Track_icons/streak_icon.png')}
                  style={styles.streakImage}
                />
            </View>
            <Text style={styles.metricsTitle}>Weeks in a row</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const TrackProgressTab = () => {
  const [trackingData, setTrackingData] = useState({ objective: '', progress: 0 });
  const [preferences, setPreferences] = useState([]);

  const Gauge = ({ progress }) => {
    return (
      <View style={styles.objectiveProgressGaugeContainer}>
        <ProgressBar progress={progress} color={colors.darkblue} style={styles.objectiveProgressProgressBar} />
      </View>
    );
  };

  const PreferencesPieChart = ({ preferences }) => {
    const [animatedData, setAnimatedData] = useState([]);
    const [endAngle, setEndAngle] = useState(0);
    const animationStarted = useRef(false); // Track if animation has started

    const centerStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -(windowWidth * 0.2 / 2) }, { translateY: -(windowWidth * 0.2 / 2) }],
      width: windowWidth * 0.2,
      height: windowWidth * 0.2,
      textAlign: 'center',
      fontSize: sizes.title,
      color: colors.darkblue,
      fontWeight: 'bold',
    };
  
    useEffect(() => {
      if (animationStarted.current) {
        return; // Exit if animation already started
      }
  
      const totalDuration = 1000; // Total duration of the animation in milliseconds
      const stepTime = totalDuration / 50; // Time per step
      let currentStep = 0;
  
      animationStarted.current = true; // Set flag to indicate animation started
  
      const intervalId = setInterval(() => {
        currentStep += 1;
        const scaleFactor = currentStep / (totalDuration / stepTime);
  
        // Update the data values
        const updatedData = preferences.map(preference => ({
          x: preference.category,
          y: preference.weight * scaleFactor,
        }));
  
        // Update the end angle of the pie chart
        const updatedEndAngle = scaleFactor * 360;
  
        setAnimatedData(updatedData);
        setEndAngle(updatedEndAngle);
  
        if (currentStep >= totalDuration / stepTime) {
          clearInterval(intervalId);
        }
      }, stepTime);
  
      return () => {
        clearInterval(intervalId); // Cleanup interval on component unmount
      };
    }, [preferences]);
  
    return (
      <View>
        <VictoryPie 
          data={animatedData}
          colorScale="qualitative"
          innerRadius={windowWidth * 0.2}
          labelRadius={({ innerRadius }) => (windowWidth * 0.4 + innerRadius) / 2.5}
          style={{ labels: { fill: 'white', fontSize: 14, fontWeight: 'bold' } }}
          labels={({ datum }) => 
            datum.y >= 5 ? `${datum.x}\n${(datum.y).toFixed(1)}%` : ''
          }
          endAngle={endAngle}
        />
        <Text style={centerStyle}>11h</Text>

      </View>
      
    );
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://3.17.219.54/user/${USERID}/tracking`);
        const data = await response.json();
        if (data.tracking) {
          setTrackingData({
            objective: data.tracking.objective,
            progress: data.tracking.progress / 100
          });
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    const fetchPreferences = async () => {
      try {
        const response = await fetch(`http://3.17.219.54/user/${USERID}/preferences`);
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchData();
    fetchPreferences();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.objectiveProgressTitle}>
        <Text style={styles.boldBlueText}>{trackingData.objective}</Text> progress
      </Text>
      <Gauge progress={trackingData.progress} />
      <Text style={styles.objectiveProgressTitle}>You Watched..</Text>
      {preferences.length > 0 && (
        <PreferencesPieChart preferences={preferences} />
      )}
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
    initialRouteName='TrackProgressTab'
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
    width: windowWidth*0.7,
    borderColor: colors.black,
    borderRadius: sizes.radius,
    borderWidth: 0,
    backgroundColor: colors.darkblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: sizes.title,
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
  boldBlueText: {
    fontWeight: 'bold',
    color: colors.darkblue,
  },
  metricsContainer: {
    width: windowWidth*0.4,
    height: windowWidth*0.4,
    borderColor: colors.black,
    borderRadius: sizes.radius,
    borderWidth: 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.l,
  },
  metricsTitle: {
    color: colors.darkblue,
    fontSize: sizes.h3,
  },
  metricsData: {
    color: colors.darkblue,
    fontSize: sizes.title*1.5,
  },
  innerContainer: {
    justifyContent: 'center',
    width: windowWidth*0.5,
    alignItems: 'center',
  },
  streakImage: {
    width: 52,
    height: 52,
  },
  streakImageContainer: {
    flexDirection: "row",
    alignItems: "center",
  }
});

export default TrackScreen;
