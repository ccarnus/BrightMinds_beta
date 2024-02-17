import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors, sizes, spacing } from '../theme';
import PolarStarIcon from '../../assets/Virtual_lab_icons/star_icon.png';
import IcebergIcon from '../../assets/Virtual_lab_icons/iceberg_icon.png';
import InfoIcon from '../../assets/Virtual_lab_icons/info_icon.png';
import CompassIcon from '../../assets/Virtual_lab_icons/compass_icon.png';
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
      setLabData(data);
      // Sort topics by gauge value in descending order
      const sortedTopics = (data.topics || []).sort((a, b) => b.gage - a.gage);
      setTopics(sortedTopics);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    }
  };

  const renderTopic = (topic) => (
    <TouchableOpacity key={topic._id} style={styles.topicContainer}>
      <Image source={IcebergIcon} style={styles.iconStyle} />
      <View style={styles.topicTextContainer}>
        <Text style={styles.topicTitle}>{topic.name}</Text>
        <View style={styles.gaugeContainer}>
          <View style={[styles.gauge, { width: `${topic.gage}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
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
      </View>
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
    backgroundColor: colors.white, // Sky part
    height: height / 3, // Static top 1/3 of the screen
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  titleOverlay: {
    position: 'absolute',
    top: spacing.m,
    alignItems: 'center',
  },
  topRightButtons: {
    position: 'absolute',
    right: spacing.m,
    top: spacing.m,
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
    marginTop: 50, // Adjust this value based on the star icon's size and desired overlap
  },
  bottomSection: {
    backgroundColor: colors.darkblue, // Water part
    height: (2 * height) / 3, // Scrollable bottom 2/3 of the screen
  },
  topRightIcon: {
    width: 40,
    height: 40,
    marginVertical: spacing.xs,
  },
  sectionContainer: {
    alignItems: 'center',
    paddingBottom: spacing.l,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.s,
    marginVertical: spacing.xs,
    width: width - 2 * spacing.s,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 40,
    height: 40,
    marginRight: spacing.s,
    resizeMode: 'contain', 
  },
  topicTextContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: sizes.h2,
    color: colors.darkblue,
  },
  gaugeContainer: {
    height: 10,
    backgroundColor: colors.gray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  gauge: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 5,
  },
});

export default VirtualLab;
