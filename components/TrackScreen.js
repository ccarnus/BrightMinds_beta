import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, ProgressBarAndroid } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';
import { VictoryPie } from 'victory-native';

const USERID = "6474e4001eec5ee1ecd40180";

const TrackScreen = () => {
  const [trackingData, setTrackingData] = useState({ objective: '', progress: 0 });
  const [preferences, setPreferences] = useState([]);
  const navigation = useNavigation();
  const BrightMindsMascot = require('../assets/Track_icons/trophy_icon.png');

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

    fetchData();
    fetchPreferences();
  }, []);

  return (
    <ScrollView style={styles.container} >
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Be part of accelerating research</Text>
        <View style={styles.infoBottomContainer}>
          <View style={styles.infoBottomContainerLeft}>
          <Text style={styles.questionsansweredNumber}>45</Text>
          <Text style={styles.questionsansweredText}>Things learned</Text>
          </View>
          <View style={styles.infoBottomContainerRight}>
            <Image source={{BrightMindsMascot}} style={styles.infoImage}/>
          </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>
        <Text style={styles.boldBlueText}>{trackingData.objective}</Text> progress
      </Text>
      <ProgressBar progress={trackingData.progress} color={colors.darkblue} style={styles.progressBar} />
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
  },
  infoBottomContainerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoImage: {
  },
  questionsansweredNumber: {
    fontSize: sizes.title,
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
    fontSize: sizes.h3,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    color: colors.primaryBis,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: sizes.h2,
    color: colors.secondary,
    marginBottom: spacing.m,
    fontFamily: 'MontserratBold',
  },
  boldBlueText: {
    fontFamily: 'MontserratBold',
    color: colors.secondary,
  },
  buttonStartWeeklyEvaluation: {
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: sizes.radius,
    marginBottom: spacing.m,
    elevation: 5,
  },
  buttonText: {
    color: colors.primaryBis,
    fontSize: sizes.title,
    fontFamily: 'Montserrat',
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
});

export default TrackScreen;
