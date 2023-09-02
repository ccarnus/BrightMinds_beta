import React from 'react';
import {View, StyleSheet, ScrollView, Text, FlatList} from 'react-native';
import ListenItem from './ListenItem';
import {colors, shadow, sizes, spacing} from '../theme';
import Carousel from './Carousel';


const Watch = [
  {
    id: 1,
    image: require('../../assets/Cast_icons/Watch/download.jpg'),
    title: 'Granada',
    location: 'Spain',
    description:
      'Granada is the capital city of the province of Granada, in the autonomous community of Andalusia, Spain',
  },
  {
    id: 2,
    image: require('../../assets/Cast_icons/Watch/toto.jpg'),
    title: 'Cherry blossoms',
    location: 'Japan',
    description:
      "Cherry blossoms usually bloom between mid-March and early May. In 2022, Tokyo's cherry blossom season officially began on March 20",
  },
    {
      id: 3,
      image: require('../../assets/Cast_icons/Watch/img1.png'),
      title: 'Amalfi',
      location: 'Italy',
      description:
        'The ultimate Amalfi Coast travel guide, where to stay, where to eat, and what areas to visit in the Amalfi Coast of Italy. Positano, Ravello, Amalfi and more',
    },
    {
      id: 4,
      image: require('../../assets/Cast_icons/Watch/download.jpg'),
      title: 'Granada',
      location: 'Spain',
      description:
        'Granada is the capital city of the province of Granada, in the autonomous community of Andalusia, Spain',
    },
    {
      id: 5,
      image: require('../../assets/Cast_icons/Watch/toto.jpg'),
      title: 'Cherry blossoms',
      location: 'Japan',
      description:
        "Cherry blossoms usually bloom between mid-March and early May. In 2022, Tokyo's cherry blossom season officially began on March 20",
    },
  ];

  const listenData = [
    { id: '1', title: 'The Future of Artificial Intelligence', duration: '5 min' },
    { id: '2', title: 'Exploring Virtual Reality', duration: '4 min' },
    { id: '3', title: 'Space Travel and Colonization', duration: '6 min' },
    { id: '4', title: 'Advancements in Renewable Energy', duration: '7 min' },
    { id: '5', title: 'Innovation in Robotics', duration: '5 min' },
    { id: '6', title: 'The Impact of Climate Change', duration: '4 min' },
    { id: '7', title: 'Biotechnology Breakthroughs', duration: '6 min' },
    { id: '8', title: 'Exploring the Deep Sea', duration: '7 min' },
    { id: '9', title: 'The History of Space Exploration', duration: '5 min' },
    { id: '10', title: 'Nanotechnology and Its Applications', duration: '4 min' },
    { id: '11', title: 'Future of Sustainable Agriculture', duration: '6 min' },
    { id: '12', title: 'Artificial Intelligence in Healthcare', duration: '7 min' },
    { id: '13', title: 'The World of Quantum Computing', duration: '5 min' },
    { id: '14', title: 'Biomedical Engineering Innovations', duration: '4 min' },
    { id: '15', title: 'Exploring Mars and Beyond', duration: '6 min' },
    { id: '16', title: 'Climate Change Solutions', duration: '7 min' },
    { id: '17', title: 'The Future of Transportation', duration: '5 min' },
    { id: '18', title: 'Sustainable Architecture', duration: '4 min' },
    { id: '19', title: 'The Marvels of Materials Science', duration: '6 min' },
    { id: '20', title: 'Renewable Energy Technologies', duration: '7 min' },
  ];

const App = () => {


    return (
    <View style={{ flex: 1 , top:20}}>
            <Text style={{ fontSize: sizes.title, fontWeight: 'bold', margin: spacing.l }}>Watch</Text>
            <Carousel list={Watch} />

            <Text style={{ fontSize: sizes.title, fontWeight: 'bold', margin: spacing.l }}>Listen</Text>
            <FlatList
                data={listenData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ListenItem title={item.title} duration={item.duration} />
                )}
            />
    </View>
      );
    };

export default App;
