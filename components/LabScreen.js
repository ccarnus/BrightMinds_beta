import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';

const LabScreen = () => {
  const [labs, setLabs] = useState([]);
  const [userLabs, setUserLabs] = useState({ member: [], follower: [] });
  const navigation = useNavigation();

  useEffect(() => {
    fetchLabs();
    fetchUserLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await fetch('http://3.17.219.54/virtual/lab');
      const data = await response.json();
      setLabs(data);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    }
  };

  const fetchUserLabs = async () => {
    try {
      const response = await fetch('http://3.17.219.54/user/6474e4001eec5ee1ecd40180');
      const data = await response.json();
      setUserLabs(data.virtual_labs);
    } catch (error) {
      console.error('Error fetching user labs:', error);
    }
  };

  const isUserLab = (labId) => {
    return userLabs.member.some(lab => lab.labId === labId) || userLabs.follower.some(lab => lab.labId === labId);
  };

  const renderLab = (lab) => (
    <View key={lab._id} style={styles.labContainer}>
      <TouchableOpacity
        style={[styles.labButton, { backgroundColor: lab.colorcode }]}
        onPress={() => navigation.navigate('VirtualLab', { labId: lab._id })}
      >
        <Image source={{ uri: lab.iconurl }} style={styles.labImage} />
      </TouchableOpacity>
      <Text style={styles.labText}>{lab.name}</Text>
    </View>
  );

  // Divide the labs for Explore Labs into two groups
  const exploreLabs = labs.filter(lab => !isUserLab(lab._id));
  const exploreLabsFirstHalf = exploreLabs.slice(0, Math.ceil(exploreLabs.length / 2));
  const exploreLabsSecondHalf = exploreLabs.slice(Math.ceil(exploreLabs.length / 2));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Labs</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalScrollView}
        style={{ marginBottom: spacing.xs }} // Reduced bottom margin
      >
        {labs.filter(lab => isUserLab(lab._id)).map(renderLab)}
      </ScrollView>

      <Text style={styles.title}>Explore Labs</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalScrollView}
      >
        {exploreLabsFirstHalf.map(renderLab)}
      </ScrollView>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalScrollView}
      >
        {exploreLabsSecondHalf.map(renderLab)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: sizes.h2,
    color: colors.black,
    marginTop: spacing.s,
    textAlign: "left",
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  labContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 3 - spacing.m,
    margin: spacing.s,
  },
  labButton: {
    width: Dimensions.get('window').width / 3 - spacing.m,
    height: Dimensions.get('window').width / 3 - spacing.m,
    borderRadius: (Dimensions.get('window').width / 3 - spacing.m) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  labText: {
    marginTop: spacing.xs,
    fontSize: sizes.body,
    color: colors.black,
    textAlign: 'center',
  },
});

export default LabScreen;
