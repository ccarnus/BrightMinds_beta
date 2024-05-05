import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';

const LabScreen = () => {
  const navigation = useNavigation();
  const [labs, setLabs] = useState([]);

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
      style={[styles.labContainer, styles.shadow]}
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
    backgroundColor: colors.primaryBis,
    overflow: 'visible',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.m,
    verflow: 'visible',
  },
  labContainer: {
    width: '90%',
    minHeight: 100, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.s,
    marginVertical: spacing.m,
    backgroundColor: colors.darkblue,
    borderRadius: sizes.radius,
},
shadow: {
  // iOS shadow properties
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 4,
    // Android shadow property
    elevation: 5,
    shadowColor: colors.secondary,
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
    color: colors.primaryBis,
    marginTop: spacing.xs,
  },
});

export default LabScreen;
