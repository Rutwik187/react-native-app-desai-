import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { LinearGradient } from "expo-linear-gradient";

const client = createClient({
  projectId: "0t3t047i",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-04-01",
});

const builder = imageUrlBuilder(client);

const App = () => {
  const [cards, setCards] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == 'links'][0].links`;
        const data = await client.fetch(query);

        setCards(data);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        Animated.spring(bounceAnim, {
          toValue: 1,
          speed: 3,
          bounciness: 4,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fadeAnim, bounceAnim]);

  const urlFor = (source) => builder.image(source);

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f9d423", "#f3a712", "#f7b731"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.header}>
          <Animated.Image
            source={{
              uri: "https://desaibandhuambewale.com/assets/logo-5a963b81.png",
            }}
            style={[styles.logo, { transform: [{ scale: bounceAnim }] }]}
          />
          <Text style={styles.title}>Desai Bandhu Ambewale</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {Array.isArray(cards) &&
            cards.map((card, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.card,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={{ uri: urlFor(card.icon).url() }}
                  style={styles.image}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => handleLinkPress(card.url)}
                  >
                    <Text style={styles.buttonText}>Go to Link</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    backgroundColor: "transparent",
    padding: 20,
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    height: 100,
    width: 200,
    objectFit: "contain",
    marginVertical: 30,
  },
  title: {
    color: "#333",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    margin: 20,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f7b731",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default App;
