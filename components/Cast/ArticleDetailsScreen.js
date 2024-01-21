    import React, { useEffect, useState } from 'react';
    import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
    import { colors, sizes, spacing } from '../theme';
    import { useNavigation } from '@react-navigation/native';

    const ArticleDetailsScreen = ({ route }) => {
    const { selectedArticleId } = route.params;
    const [article, setArticle] = useState(null);
    const [universityLogo, setUniversityLogo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

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

    const fetchUniversityLogo = async (universityName) => {
        try {
        const response = await fetch(`http://3.17.219.54/university/by/name/${universityName}`);
        const data = await response.json();
        setUniversityLogo(data.iconurl);
        } catch (error) {
        console.error('Error fetching university logo:', error);
        }
    };

    const getDaysSincePosted = (dateString) => {
        const datePosted = new Date(dateString);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - datePosted.getTime();
        return Math.floor(differenceInTime / (1000 * 3600 * 24));
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
        {universityLogo && <Image source={{ uri: universityLogo }} style={styles.universityLogo} />}
        
        <View style={styles.infoDisplay}>
            <Text style={styles.infoText}>{getDaysSincePosted(article.dateAdded)} days ago</Text>
            <Text style={styles.separator}>  ·  </Text>
            <Text style={styles.infoText}>{article.department}</Text>
            <Text style={styles.separator}>  ·  </Text>
            <Text style={styles.infoText}>{article.duration} min</Text>
        </View>
    
        <View style={styles.content}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.description}>{article.articleDescription}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Got it!</Text>
        </TouchableOpacity>
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
        marginBottom: spacing.m,
    },
    content: {
        padding: spacing.m,
    },
    title: {
        fontSize: sizes.title,
        fontWeight: 'bold',
        marginBottom: spacing.s,
        textAlign:"justify",
    },
    description: {
        fontSize: sizes.h3,
        color: colors.text,
        textAlign:"justify",
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
    universityLogo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: spacing.m,
    },
    button: {
        backgroundColor: colors.darkblue,
        borderRadius: sizes.radius*2,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        alignSelf: 'center',
        marginBottom: spacing.l*2,
    },
    buttonText: {
        color: colors.white,
        fontSize: sizes.title,
        textAlign: 'center',
    },
    infoDisplay: {
        backgroundColor: 'rgba(11, 11, 11, 0.5)',
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
        fontSize: sizes.h3,
        color: colors.white,
        paddingHorizontal: spacing.xs,
      },
      separator: {
        fontSize: sizes.title,
        color: colors.white,
        paddingHorizontal: spacing.xs,
      },
    });

    export default ArticleDetailsScreen;
