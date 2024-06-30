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

  useEffect(() => {
    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    try {
      const response = await fetch(`http://3.17.219.54/cast/${labId}`);
      const data = await response.json();
      setLabData(data);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.lightblue, colors.darkblue]}
        style={styles.topSection}>
        <Image source={MainIcebergIcon} style={styles.mainIcebergIcon} />
        <View style={styles.titleOverlay}>
          <Image source={PolarStarIcon} style={styles.polarStarIcon} />
          <Text style={styles.labTitle}>{labId || 'Exploring the Iceberg'}</Text>
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
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.primaryBis,
    height: (2 * height) / 3,
  },
  topRightIcon: {
    width: 30,
    height: 30,
    marginVertical: spacing.s,
  },
});

export default VirtualLab;
