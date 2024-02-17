import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { colors, sizes, spacing } from '../theme';

const ICON_SIZE = 35;

const VirtualLab = ({ route }) => {
  const { labId } = route.params;
  const [labData, setLabData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [members, setMembers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [topics, setTopics] = useState([]);


  useEffect(() => {
    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    try {
      const response = await fetch(`http://3.17.219.54/virtual/lab/${labId}`);
      const data = await response.json();
      setLabData(data);
      fetchUserData(data.followers, setFollowers);
      fetchUserData(data.members, setMembers);
      fetchInstituteData(data.institute);
      setTopics(data.topics || []);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    }
  };

const fetchInstituteData = async (instituteList) => {
  try {
    const instituteData = await Promise.all(
      instituteList.map(async (institute) => {
        const response = await fetch(`http://3.17.219.54/university/${institute.instituteID}`);
        return response.json();
      })
    );

    const sortedInstitutes = instituteData.sort((a, b) => b.score - a.score);

    setInstitutes(sortedInstitutes);
  } catch (error) {
    console.error('Error fetching institute data:', error);
  }
};

  const fetchUserData = async (userList, setUserList) => {
    try {
      const profiles = await Promise.all(
        userList.map(async (user) => {
          const response = await fetch(`http://3.17.219.54/user/${user.userID || user.brightmindsID}`);
          return response.json();
        })
      );
      setUserList(profiles);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const renderTopic = (topic) => (
    <View key={topic._id} style={styles.topicContainer}>
      <Text style={styles.topicTitle}>{topic.name}</Text>
      <View style={styles.gaugeContainer}>
        <View style={[styles.gauge, { width: `${topic.gage}%` }]} />
      </View>
    </View>
  );  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.labTitle}>{labData?.name}</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Followers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {followers.map((follower) => (
            <Image key={follower._id} source={{ uri: follower.profilePictureUrl }} style={styles.profileImage} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Members</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {members.map((member) => (
            <Image key={member._id} source={{ uri: member.profilePictureUrl }} style={styles.profileImage} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Leaders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {institutes.map((institute) => (
            <View key={institute._id} style={styles.instituteImage}>
              <Image source={{ uri: institute.iconurl }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ongoing Research</Text>
        {topics.map(renderTopic)}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  labTitle: {
    fontSize: sizes.title,
    color: colors.black,
    textAlign: 'center',
    marginTop: spacing.l*2,
    marginBottom: spacing.m,
  },
  sectionContainer: {
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: sizes.h3,
    color: colors.black,
    marginLeft: spacing.s,
    marginBottom: spacing.xs,
  },
  scrollContainer: {
    paddingLeft: spacing.s,
  },
  profileImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    overflow: 'hidden',
    marginLeft: spacing.s,
  },
  instituteImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    overflow: 'hidden',
    marginLeft: spacing.s
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  topicContainer: {
    backgroundColor: colors.darkblue,
    borderRadius: 10,
    padding: spacing.s,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.s,
    marginBottom: spacing.l,
  },
  topicTitle: {
    fontSize: sizes.h2,
    color: colors.black,
    color: colors.white,
  },
  gaugeContainer: {
    height: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  gauge: {
    height: '100%',
    backgroundColor: colors.green,
    borderRadius: 5,
  },
});

export default VirtualLab;
