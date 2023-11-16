import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, shadow, sizes, spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';

const CARD_WIDTH = sizes.width /2.5;
const CARD_HEIGHT = 250;
const CARD_HEIGHT_TOTAL = 250;
const CARD_WIDTH_SPACING = CARD_WIDTH + spacing.l;

const Carousel = ({ list}) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={list}
      horizontal
      snapToInterval={CARD_WIDTH_SPACING}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      keyExtractor={i => i.id}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={{
              marginLeft: spacing.l,
              marginRight: index === list.length - 1 ? spacing.l : 0,
            }}
            onPress={() => navigation.navigate('SuggestedForYou', { selectedVideoId: item.id })}>
            <View style={[styles.card, shadow.dark]}>
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  onError={() => console.log(`Error loading image for ${item.title}`)}
                />
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT_TOTAL,
    marginVertical: 10,
    position: 'relative',
  },
  imageBox: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: sizes.radius,
    overflow: 'hidden',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    resizeMode: 'cover',
  },
  titleBox: {
    position: 'absolute',
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    top: CARD_HEIGHT - 50,
    maxHeight: 50,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.black,
    paddingRight: 10,
  },
});

export default Carousel;
