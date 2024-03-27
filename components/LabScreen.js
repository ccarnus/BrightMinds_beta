import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';

const LabScreen = () => {
  const navigation = useNavigation();
  const [labs, setLabs] = useState([]);

  // Fetch labs data
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch('http://3.17.219.54/virtual/lab');
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };

    fetchLabs();
  }, []);

  const renderLab = (lab) => {
    return (
      <TouchableOpacity
        key={lab._id}
        style={styles.labContainer}
        onPress={() => navigation.navigate('VirtualLab', { labId: lab._id })}
      >
        <Image source={{ uri: lab.iconurl }} style={styles.labImage} resizeMode="contain" />
        <Text style={styles.labText}>{lab.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {labs.map(renderLab)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkblue,
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.l,
  },
  labContainer: {
    width: '90%',
    minHeight: 100, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.s,
    marginVertical: spacing.m,
    backgroundColor: colors.lightblue,
    borderRadius: spacing.s
  },
  labImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  labText: {
    fontSize: sizes.h3,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    color: colors.white,
    marginTop: spacing.xs,
  },
});

export default LabScreen;
