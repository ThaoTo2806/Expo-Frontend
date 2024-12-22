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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function ProductDetailById() {
  const navigation = useNavigation();
  const { MaSP } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [token, setToken] = useState(null); // state for total amount in the cart

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userInfo");
        const parsedToken = JSON.parse(storedToken); // Chuyển chuỗi JSON thành đối tượng
        console.log("parsedToken: ", parsedToken.token); // In ra đối tượng đã chuyển
        if (parsedToken) {
          setToken(parsedToken.token); // Lưu trữ token vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy token: ", error);
      }
    };

    fetchToken();

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
            {/* Display the totalAmount as a small badge */}
            {totalAmount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalAmount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });

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

    // Fetch the totalAmount from the cart when the component is loaded
    if (token) {
      axios
        .get("http://192.168.1.8:5000/api/giohang", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Calculate totalAmount from the response
          const total = response.data.cart.reduce(
            (sum, item) => sum + item.GiaBan * item.SoLuong,
            0
          );
          setTotalAmount(total);
        })
        .catch(() => {
          console.log("Không thể lấy thông tin giỏ hàng.");
        });
    }
  }, [MaSP, navigation, token]);

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
      <ActionTabs
        onChat={() => Alert.alert("Chat", "Chat ngay")}
        onAddToCart={addToCart}
      />
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

const ActionTabs = ({ token, onChat, onAddToCart }) => (
  <View style={styles.actionTabs}>
    <ActionButton
      text="Chat ngay"
      icon="chatbubble-ellipses-outline"
      onPress={onChat}
      color="#e62e00"
    />
    <ActionButton
      text="Thêm giỏ hàng"
      icon="cart-outline"
      onPress={onAddToCart}
      color="#e62e00"
    />
    <ActionButton
      text="Mua ngay"
      icon="bag-handle-outline"
      onPress={() => Alert.alert("Mua ngay", `Token hiện tại: ${token}`)}
      backgroundColor="#e62e00"
      textColor="white"
    />
  </View>
);

const ActionButton = ({
  text,
  icon,
  onPress,
  color,
  backgroundColor = "white",
  textColor = "black",
}) => (
  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor }]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={24} color={color} />
    <Text style={[styles.actionButtonText, { color: textColor }]}>{text}</Text>
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
  headerActions: { flexDirection: "row", gap: 15, marginRight: 10 },
  actionTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  actionButtonText: { fontSize: 13 },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#e62e00",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
