import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import ProductItem from "./ProductItem";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch product data when the component mounts
    axios
      .get("http://192.168.1.8:5000/api/sanpham")
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data: ", error);
        setLoading(false);
      });
  }, []);

  const handleProductPress = async (item) => {
    const userInfo = await AsyncStorage.getItem("userInfo");

    if (!userInfo) {
      Alert.alert("Login Required", "Please log in to view product details.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/login") },
      ]);
    } else {
      router.push(`/pdt/${item.MaSP}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const displayedProducts = showAll ? products : products.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.conC}>
        <Text style={styles.name}>All Products</Text>
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.textA}>{showAll ? "Hide" : "View All"}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayedProducts}
        numColumns={2}
        renderItem={({ item, index }) => (
          <View style={styles.productItem}>
            <Image style={styles.productImage} source={{ uri: item.Anh }} />
            <Text style={styles.productText}>{item.TenSP}</Text>
            <ProductItem
              product={item}
              key={index}
              onProductPress={() => handleProductPress(item)} // Pass the product item to the function
            />
          </View>
        )}
        keyExtractor={(item) => item.MaSP}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: "outfit-Bold",
  },
  productItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  productText: {
    fontSize: 16,
    marginBottom: 10,
  },
  textA: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-medium",
  },
  conC: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
