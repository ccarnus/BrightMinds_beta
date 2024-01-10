import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors, sizes, spacing } from './theme';

const LabScreen = () => {
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    fetchLabs();
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

  // Function to generate random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Labs</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {labs.map((lab) => (
          <View key={lab._id} style={styles.labContainer}>
            <TouchableOpacity style={[styles.labButton, { backgroundColor: getRandomColor() }]}>
              <Image source={{ uri: lab.iconurl }} style={styles.labImage} />
            </TouchableOpacity>
            <Text style={styles.labText}>{lab.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: sizes.title,
    color: colors.black,
    marginTop: spacing.m,
    marginBottom: spacing.m,
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
