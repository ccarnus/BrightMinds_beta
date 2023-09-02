import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {colors, shadow, sizes, spacing} from '../theme';

const ListenItem = ({ title, duration }) => (
  <View style={styles.container}>
    <View style={styles.textContainer}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </View>
    <View style={styles.playButtonContainer}>
      <TouchableOpacity style={styles.playButton}>
        <AntDesign name="play" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.durationText}>{duration}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Allow the text to expand and be ellipsized
  },
  title: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colors.white,
    // fontFamily: 'Montserrat',
  },
  playButtonContainer: {
    flexDirection: 'column', 
    alignItems: 'center',
  },
  playButton: {
    //backgroundColor: '#3498db',
    padding: 0,
    borderRadius: 5,
  },
  durationText: {
    fontSize: 14,
    color: colors.black,
    fontStyle: 'italic',
    marginTop: 3,
  },
});

export default ListenItem;
