import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors, sizes, spacing } from '../theme';
import PolarStarIcon from '../../assets/Virtual_lab_icons/star_icon.png';
import InfoIcon from '../../assets/Virtual_lab_icons/info_icon.png';
import CompassIcon from '../../assets/Virtual_lab_icons/compass_icon.png';
import MainIcebergIcon from '../../assets/Virtual_lab_icons/main_iceberg_icon.png';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const VirtualLab = ({ route }) => {
  const { labId } = route.params;
  const [labData, setLabData] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    try {
      const response = await fetch(`http://3.17.219.54/virtual/lab/${labId}`);
      const data = await response.json();
      const topicsWithInstitutes = await Promise.all(data.topics.map(async (topic) => {
        const institutes = await Promise.all(topic.institutes.map(async (institute) => {
          const res = await fetch(`http://3.17.219.54/university/${institute.instituteId}`);
          return await res.json();
        }));
        return { ...topic, institutes };
      }));
      setLabData(data);
      setTopics(topicsWithInstitutes);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    }
  };
  

  const renderTopic = (topic) => (
    <TouchableOpacity key={topic._id} style={styles.topicContainer}>
      <View style={styles.topicTextContainer}>
        <Text style={styles.topicTitle}>{topic.name}</Text>
        <View style={styles.instituteLogosContainer}>
          {topic.institutes.map((institute) => (
            <Image key={institute._id} source={{ uri: institute.iconurl }} style={styles.instituteLogo} />
          ))}
        </View>
        <Text style={styles.topicDescription}>{topic.description}</Text>
        <View style={styles.gaugeContainer}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[colors.lightblue, colors.darkblue]}
            style={[styles.gauge, { width: `${topic.gage}%` }]}
          />
          <View style={styles.gaugePercentageContainer}>
            <Text style={styles.gaugePercentageText}>{`${topic.gage}%`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.lightblue, colors.darkblue]}
        style={styles.topSection}>
        <Image source={MainIcebergIcon} style={styles.mainIcebergIcon} />
        <View style={styles.titleOverlay}>
          <Image source={PolarStarIcon} style={styles.polarStarIcon} />
          <Text style={styles.labTitle}>{labData?.name || 'Exploring the Iceberg'}</Text>
        </View>
        <View style={styles.topRightButtons}>
          <TouchableOpacity>
            <Image source={InfoIcon} style={styles.topRightIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={CompassIcon} style={styles.topRightIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView style={styles.bottomSection}>
        <View style={styles.sectionContainer}>
          {topics.map(renderTopic)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: height / 3, // Static top 1/3 of the screen
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainIcebergIcon: {
    position: 'relative',
    marginBottom: -100,
    width: '100%', // Ensure it spans the entire width
    resizeMode: 'contain', // Keep aspect ratio
  },
  titleOverlay: {
    position: 'absolute',
    top: spacing.m,
    alignItems: 'center',
  },
  topRightButtons: {
    position: 'absolute',
    right: spacing.m,
    bottom: spacing.l,
    alignItems: 'center',
  },
  polarStarIcon: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
  },
  labTitle: {
    fontSize: sizes.title,
    color: colors.darkblue,
    textAlign: 'center',
    marginTop: 60,
    marginLeft:10,
    marginRight:10,
    fontFamily: "MontserratBold",
  },
  bottomSection: {
    backgroundColor: colors.darkblue,
    height: (2 * height) / 3,
  },
  topRightIcon: {
    width: 30,
    height: 30,
    marginVertical: spacing.s,
  },
  sectionContainer: {
    alignItems: 'center',
    paddingBottom: spacing.l,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkblue,
    borderRadius: 10,
    padding: spacing.s,
    marginVertical: spacing.l,
    width: width - 2 * spacing.s,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 60,
    height: 60,
    marginRight: spacing.s,
    resizeMode: 'contain', 
  },
  topicTextContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: sizes.h2,
    color: colors.white,
    fontFamily: "Montserrat",
  },
  gaugeContainer: {
    height: 20, // Increased height for better visibility
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginTop: 5,
    position: 'relative', // Needed to position the percentage text absolutely within
    justifyContent: 'center', // Center the text vertically
  },
  gauge: {
    height: '100%',
    backgroundColor: colors.lightblue,
    borderRadius: 5,
  },
  gaugePercentageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugePercentageText: {
    color: colors.white, // Assuming white color for the percentage text
    fontSize: sizes.body,
    fontFamily: 'MontserratBold',
  },
  instituteLogosContainer: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  instituteLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: spacing.s,
  },
  topicDescription: {
    color: colors.white,
    fontSize: sizes.body,
    marginVertical: spacing.xs,
    fontFamily: 'Montserrat',
    textAlign: "justify", 
  },
  
});

export default VirtualLab;