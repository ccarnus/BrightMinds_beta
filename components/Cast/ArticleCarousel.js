import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, shadow, sizes, spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';

const CARD_WIDTH = sizes.width / 1.8;
const CARD_HEIGHT = 150;
const CARD_HEIGHT_TOTAL = 200;
const CARD_WIDTH_SPACING = CARD_WIDTH + spacing.l;

const ArticleCarousel = ({ list }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={list}
      horizontal
      snapToInterval={CARD_WIDTH_SPACING}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item._id}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={{
            marginLeft: spacing.l,
            marginRight: index === list.length - 1 ? spacing.l : 0,
          }}
          onPress={() => navigation.navigate('ArticleDetails', { selectedArticleId: item._id })}>
          <View style={[styles.card, shadow.dark]}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.imageBox}>
              <Image
                source={{ uri: item.articleimageurl }}
                style={styles.image}
                onError={() => console.log(`Error loading image for ${item.title}`)}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
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
        top: CARD_HEIGHT_TOTAL - 50,
        maxHeight: 50,
        width: '100%',
      },
      title: {
        fontSize: sizes.h45,
        color: colors.black,
        paddingRight: 10,
        textAlign: 'left',
        marginLeft: 10,
      },
});

export default ArticleCarousel;
