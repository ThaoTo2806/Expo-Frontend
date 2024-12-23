import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function ProductDetailById() {
  const navigation = useNavigation();
  const { MaSP } = useLocalSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [distinctProductCount, setDistinctProductCount] = useState(0);
  const [token, setToken] = useState(null);

  // Fetch token from local storage
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userInfo");
        const parsedToken = JSON.parse(storedToken);
        if (parsedToken?.token) {
          setToken(parsedToken.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  // Set navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={navigation.goBack}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => Alert.alert("Giỏ hàng", "Chuyển tới giỏ hàng!")}
          >
            <Ionicons name="cart-outline" size={24} color="black" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{distinctProductCount}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="share-social-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [distinctProductCount]);

  // Fetch product details
  useEffect(() => {
    if (MaSP) {
      axios
        .get(`http://192.168.1.8:5000/api/sanpham/${MaSP}`)
        .then((response) => {
          setProduct(response.data.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Không thể tải dữ liệu sản phẩm.");
          setLoading(false);
        });
    }
  }, [MaSP]);

  // Fetch cart details
  const fetchCartData = async () => {
    try {
      if (!token) return;
      const response = await axios.get("http://192.168.1.8:5000/api/giohang", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCartItems(response.data.cart);
        setDistinctProductCount(response.data.distinctProductCount);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [token]);

  // Add to cart handler
  const addToCart = async () => {
    try {
      if (!token) {
        throw new Error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      }

      const response = await axios.post(
        "http://192.168.1.8:5000/api/giohang",
        {
          MaSP: product.MaSP,
          TenSP: product.TenSP,
          GiaBan: product.GiaBan,
          Anh: product.Anh,
          SoLuong: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(
        "Thành công",
        response.status === 200
          ? "Sản phẩm đã được thêm vào giỏ hàng!"
          : "Không thể thêm sản phẩm vào giỏ hàng."
      );

      // Gọi lại API để cập nhật số lượng sản phẩm trong giỏ hàng
      await fetchCartData();
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView>
        <Image style={styles.productImage} source={{ uri: product.Anh }} />
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{product.GiaBan} đ</Text>
          <Text style={styles.productStock}>Còn: {product.SLTon}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.TenSP}</Text>
          <Text style={styles.sectionTitle}>Giới thiệu về sản phẩm này</Text>
          <Text style={styles.productDescription}>{product.MoTa}</Text>
        </View>
      </ScrollView>
      <ActionTabs onAddToCart={addToCart} />
    </SafeAreaView>
  );
}

const Loading = () => (
  <View style={styles.centeredContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Đang tải dữ liệu sản phẩm...</Text>
  </View>
);

const ErrorMessage = ({ error }) => (
  <View style={styles.centeredContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
);

const ActionTabs = ({ onAddToCart }) => (
  <View style={styles.actionTabs}>
    <ActionButton
      text="Thêm giỏ hàng"
      icon="cart-outline"
      onPress={onAddToCart}
      color="white"
    />
  </View>
);

const ActionButton = ({ text, icon, onPress, color }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.actionButtonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: { width: screenWidth, height: 400, resizeMode: "cover" },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  productPrice: { fontSize: 20, color: "black", fontWeight: "bold" },
  productStock: { fontSize: 15, color: "#e62e00" },
  infoContainer: { padding: 10 },
  productName: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
    fontWeight: "bold",
  },
  sectionTitle: { fontSize: 18, color: "black", marginBottom: 5 },
  productDescription: { fontSize: 15, color: "black", textAlign: "justify" },
  headerButton: { padding: 10 },
  headerActions: { flexDirection: "row", marginRight: 10 },
  cartBadge: {
    position: "absolute",
    backgroundColor: "#e62e00",
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 2,
    top: -8,
    right: -8,
  },
  cartBadgeText: { fontSize: 10, color: "white" },
  actionTabs: { flexDirection: "row", padding: 10 },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#e62e00",
  },
  actionButtonText: { fontSize: 14, color: "white" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
});
