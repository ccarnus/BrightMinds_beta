    import React, { useEffect, useState } from 'react';
    import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
    import { colors, sizes, spacing } from '../theme';
    import { useNavigation } from '@react-navigation/native';

    const ArticleDetailsScreen = ({ route }) => {
    const { selectedArticleId } = route.params;
    const [article, setArticle] = useState(null);
    const [universityLogo, setUniversityLogo] = useState(null);
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const userId = "6474e4001eec5ee1ecd40180";

    useEffect(() => {
        const fetchArticle = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://3.17.219.54/article/${selectedArticleId}`);
            const data = await response.json();
            setArticle(data);
            await fetchUniversityLogo(data.university);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
        };
        fetchArticle();
    }, [selectedArticleId]);

    useEffect(() => {
      const fetchAuthor = async () => {
        try {
          const response = await fetch('http://3.17.219.54/user/6474e4d31eec5ee1ecd40194');
          const data = await response.json();
          setAuthor(data);
        } catch (error) {
          console.error('Error fetching author data:', error);
        }
      };
  
      fetchAuthor();
    }, []);

    const fetchUniversityLogo = async (universityName) => {
        try {
        const response = await fetch(`http://3.17.219.54/university/by/name/${universityName}`);
        const data = await response.json();
        setUniversityLogo(data.iconurl);
        } catch (error) {
        console.error('Error fetching university logo:', error);
        }
    };

    const handleAddToCastList = async () => {
        const contentId = selectedArticleId;
        const url = `http://3.17.219.54/user/add/content/${userId}`;
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contentId: contentId, type: "article" }),
          });
      
          const result = await response.json();
          if (response.ok) {
            //alert('Cast added to your list successfully!');
            navigation.goBack();
          } else {
            console.error('Failed to add cast to list:', result);
            alert('Failed to add cast to your list.');
          }
        } catch (error) {
          console.error('Error adding cast to list:', error);
          alert('Error adding cast to your list.');
        }
      };
      
      

      const getDaysSincePosted = (dateString) => {
        const datePosted = new Date(dateString);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        datePosted.setHours(0, 0, 0, 0);
    
        const differenceInTime = currentDate.getTime() - datePosted.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
        if (differenceInDays === 0) {
            return "today";  // Return 'today' if the difference is zero
        } else {
            return `${differenceInDays} days ago`;  // Otherwise return the number of days ago
        }
    };
    

    if (isLoading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    if (!article) {
        return (
        <View style={styles.centered}>
            <Text>Article not found</Text>
        </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: article.articleimageurl }} style={styles.image} />
            {universityLogo && (
              <View style={styles.iconContainer}>
                <Image source={{ uri: universityLogo }} style={styles.icon} />
                <Text style={styles.iconText}>{article.university}</Text>
              </View>
            )}

            {author && (
              <View style={styles.iconContainer}>
                <Image source={{ uri: author.profilePictureUrl }} style={styles.icon} />
                <Text style={styles.iconText}>{author.username}</Text>
              </View>
            )}
            
            <View style={styles.infoDisplay}>
                <Text style={styles.infoText}>{getDaysSincePosted(article.dateAdded)}</Text>
                <Text style={styles.separator}>  ·  </Text>
                <Text style={styles.infoText}>{article.department}</Text>
                <Text style={styles.separator}>  ·  </Text>
                <Text style={styles.infoText}>{article.duration} min</Text>
            </View>

        
            <View style={styles.content}>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.description}>{article.articleDescription}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToCastList}>
                    <Text style={styles.buttonAddText}>Got it!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.accessButton]} >
                    <Text style={styles.buttonAccessText}>Access Full Research</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        marginBottom: spacing.s,
    },
    content: {
        padding: spacing.m,
    },
    title: {
        fontSize: sizes.h1,
        marginBottom: spacing.m,
        fontFamily: "MontserratBold",
        textAlign: "center",
    },
    description: {
        fontSize: sizes.h3,
        color: colors.text,
        textAlign:"justify",
        fontFamily: "Montserrat",
    },
    detail: {
        fontSize: sizes.h1,
        color: colors.gray,
        marginBottom: spacing.xs,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: spacing.s,
    },
    
    icon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      marginRight: spacing.s,
    },
    
    iconText: {
      fontSize: sizes.h3,
      color: colors.black,
      fontFamily: 'Montserrat',
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: spacing.l*2,
      },
      button: {
        backgroundColor: colors.darkblue,
        borderRadius: sizes.radius*2,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        width: '80%',
        marginVertical: spacing.s,
      },
      buttonAddText: {
        color: colors.white,
        fontSize: sizes.title,
        textAlign: 'center',
        fontFamily: "MontserratBold",
      },
      buttonAccessText: {
        color: colors.white,
        fontSize: sizes.h2,
        textAlign: 'center',
        fontFamily: "MontserratBold",
      },
    infoDisplay: {
        backgroundColor: colors.darkblue,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.m,
        borderRadius: sizes.radius,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginHorizontal: spacing.m,
        marginBottom: spacing.m,
      },
      infoText: {
        fontSize: sizes.h4,
        color: colors.white,
        paddingHorizontal: spacing.xs,
        fontFamily: "MontserratBold",
      },
      separator: {
        fontSize: sizes.title,
        color: colors.white,
        paddingHorizontal: spacing.xs,
        fontFamily: "MontserratBold",
      },
    });

    export default ArticleDetailsScreen;
