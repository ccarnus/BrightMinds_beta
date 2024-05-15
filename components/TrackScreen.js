import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, ProgressBarAndroid } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import { VictoryPie } from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';

const USERID = "6474e4001eec5ee1ecd40180";

const TrackScreen = () => {
  const [trackingData, setTrackingData] = useState({ objective: '', progress: 0 });
  const [preferences, setPreferences] = useState([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const navigation = useNavigation();
  const BrightMindsMascot = require('../assets/Track_icons/BrightMindsMascot.png');

  const handleReadyScreenPress = () => {
    navigation.navigate('Ready');
  };

  useEffect(() => {
    // Fetch tracking data
    const fetchData = async () => {
      try {
        const response = await fetch(`http://3.17.219.54/user/${USERID}/tracking`);
        const data = await response.json();
        if (data.tracking) {
          setTrackingData({
            objective: data.tracking.objective,
            progress: data.tracking.progress / 100,
          });
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    // Fetch preferences
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`http://3.17.219.54/user/${USERID}/preferences`);
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences.map(preference => ({ x: preference.category, y: preference.weight })));
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    // Fetch user data to get the number of answered evaluations
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://3.17.219.54/user/${USERID}`);
        const data = await response.json();
        if (data.evaluation_list) {
          const answeredEvaluations = data.evaluation_list.filter(evaluation => evaluation.answered).length;
          setAnsweredCount(answeredEvaluations);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
    fetchPreferences();
    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container} >
      <LinearGradient
        colors={[colors.lightblue, colors.darkblue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoContainer}
      >
        <Text style={styles.infoText}>Understand the research shaping tomorrow's world</Text>
        <View style={styles.infoBottomContainer}>
          <View style={styles.infoBottomContainerLeft}>
          <Text style={styles.questionsansweredNumber}>{answeredCount}</Text>
          <Text style={styles.questionsansweredText}>Things learned</Text>
          </View>
          <View style={styles.infoBottomContainerRight}>
            <Image source={BrightMindsMascot} style={styles.infoImage}/>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.ProgressContainer}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.ProgressText}>{trackingData.objective}</Text> progress
        </Text>
        <ProgressBar progress={trackingData.progress} color={colors.darkblue} style={styles.progressBar} />
      </View>
      <View>
      {preferences.length > 0 && (
          <VictoryPie 
          data={preferences}
          colorScale="qualitative"
          innerRadius={55}
          labelRadius={({ innerRadius }) => (Dimensions.get('window').width * 0.4 + innerRadius) / 2.5}
          style={{ labels: { fill: 'white', fontSize: 14, fontFamily: 'MontserratBold', justifyContent: 'center', alignItems: 'center'} }}
          labels={({ datum }) => datum.y > 5 ? `${datum.x}` : ''}
          width={Dimensions.get('window').width}
          />
      )}
      </View>
      <TouchableOpacity style={styles.buttonStartWeeklyEvaluation} onPress={handleReadyScreenPress}>
        <Text style={styles.buttonText}>Take Test</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBis,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: spacing.s,
    marginVertical: spacing.m,
    backgroundColor: colors.darkblue,
    marginLeft: spacing.m,
    marginRight: spacing.m,
    marginBottom: spacing.m,
    marginTop: spacing.m,
    borderRadius: sizes.radius,
    elevation: 5,
  },
  infoBottomContainer: {
    flexDirection: 'row',
  },
  infoBottomContainerLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  infoBottomContainerRight: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  infoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  questionsansweredNumber: {
    fontSize: sizes.title*2,
    textAlign: 'center',
    fontFamily: 'MontserratBold',
    color: colors.primaryBis,
    marginTop: spacing.xs,
  },
  questionsansweredText: {
    fontSize: sizes.h4,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    color: colors.primaryBis,
    marginTop: spacing.xs, 
  },
  infoText: {
    fontSize: sizes.h2,
    textAlign: 'left',
    fontFamily: 'Montserrat',
    color: colors.primaryBis,
    marginTop: spacing.xs,
    padding: 5,
  },
  sectionTitle: {
    fontSize: sizes.h2,
    color: colors.secondary,
    marginBottom: spacing.m,
    fontFamily: 'Montserrat',
  },
  ProgressText: {
    fontFamily: 'MontserratBold',
    color: colors.secondary,
  },
  buttonStartWeeklyEvaluation: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    elevation: 5,
    width: '80%',
    marginLeft: '10%',
    padding: 15,
    borderRadius: sizes.radius,
    marginBottom: spacing.m,
  },
  buttonText: {
    fontSize: sizes.h3,
    color: colors.primaryBis,
    fontFamily: 'MontserratBold',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: sizes.radius,
  },
  WatchTimeText: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: colors.secondary,
  },
  ProgressContainer: {
    width: '90%',
    marginLeft: '5%',
  }
});

export default TrackScreen;
