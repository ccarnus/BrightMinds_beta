import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, shadow, sizes, spacing } from '../theme';
import { Video } from 'expo-av';
import { getThumbnailAsync } from 'expo-video-thumbnails';

const CARD_WIDTH = sizes.width /1.5;
const CARD_HEIGHT = 400;
const CARD_HEIGHT_TOTAL = 400;
const CARD_WIDTH_SPACING = CARD_WIDTH + spacing.l;

const Carousel = ({ list }) => {
  const [thumbnailUri, setThumbnailUri] = useState({});

  useEffect(() => {
    async function fetchThumbnails() {
      const thumbnails = {};
      for (const item of list) {
        try {
          console.log(item.image);
          const { uri } = await getThumbnailAsync(item.image, {
            time: 0,
          });
          thumbnails[item.id] = uri;
        } catch (e) {
          console.error(`Error fetching thumbnail for item ${item.id}:`, e);
        }
      }
      setThumbnailUri(thumbnails);
    }

    fetchThumbnails();
  }, [list]);

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
            }}>
            <View style={[styles.card, shadow.dark]}>
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: thumbnailUri[item.id] }}
                  style={styles.image}
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
    top: CARD_HEIGHT - 80,
    left: 16,
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.black,
  },
  location: {
    fontSize: sizes.h3,
    color: colors.black,
  },
});

export default Carousel;
