import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const CatchUpScreen = () => {
  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: 'http://3.17.219.54/backend/media/cast_videos/phd3.mp41686419427878.mp4'
        }}
        controls={true}
        ref={(ref) => {
        this.player = ref
    }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  video: {
    width: 300,
    height: 200,
    marginTop: 20,
  },
});

export default CatchUpScreen;
