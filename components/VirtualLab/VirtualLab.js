import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { colors, sizes, spacing } from '../theme';

const VirtualLab = ({ route }) => {
  const { labId } = route.params;
  const [labData, setLabData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [members, setMembers] = useState([]);

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
    } catch (error) {
      console.error('Error fetching lab data:', error);
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

  return (
    <View style={styles.container}>
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
    </View>
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
    marginTop: spacing.m,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.s,
  },
});

export default VirtualLab;
