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

      {/* Track Progress Section */}
      <View style={styles.sectionContainer}>
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
      </View>

      {/* Evaluation */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.buttonStartWeeklyEvaluation} onPress={handleReadyScreenPress}>
          <Text style={styles.buttonText}>Take Test</Text>
        </TouchableOpacity>
      </View>

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
  sectionContainer: {
    padding: spacing.l,
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
