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
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function ProductDetailById() {
  const navigation = useNavigation();
  const { MaSP } = useLocalSearchParams();
  const router = useRouter();

  // State để lưu trữ dữ liệu sản phẩm và trạng thái tải
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerTransparent: true, // Làm trong suốt thanh điều hướng
      headerStyle: styles.headerStyle,
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Ionicons
            name="arrow-back-outline" // Biểu tượng mũi tên quay lại
            size={24}
            color="black"
            onPress={() => navigation.goBack()} // Xử lý sự kiện quay lại
          />
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="cart-outline"
              size={24}
              color="black"
              onPress={() =>
                checkLogin(() =>
                  Alert.alert("Giỏ hàng", "Chuyển tới giỏ hàng!")
                )
              }
            />
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="share-social-outline" size={24} color="black" />
          </View>
        </View>
      ),
    });

    // Gọi API với MaSP
    if (MaSP) {
      axios
        .get(`http://192.168.1.8:5000/api/sanpham/${MaSP}`)
        .then((response) => {
          setProduct(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data: ", error);
          setError("Không thể tải dữ liệu sản phẩm.");
          setLoading(false);
        });
    }
  }, [MaSP, navigation]);

  const checkLogin = async (callback) => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo !== null) {
        callback();
      } else {
        Alert.alert(
          "Yêu cầu đăng nhập",
          "Bạn cần đăng nhập để thực hiện chức năng này.",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Đăng nhập",
              onPress: () => router.push("/login"), // Sử dụng router.push để điều hướng
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error checking login status: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải dữ liệu sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent={true} // Kích hoạt chế độ trong suốt
        backgroundColor="transparent" // Đặt màu nền trong suốt
        barStyle="light-content" // Màu nội dung (trắng sáng)
        hidden={false} // Hiển thị thanh trạng thái
      />
      <ScrollView>
        <Image style={styles.productImage} source={{ uri: product.Anh }} />

        {/* Giá bán và số lượng tồn */}
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{product.GiaBan} đ</Text>
          <Text style={styles.productStock}>Còn: {product.SLTon}</Text>
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.flashSaleContainer}>
          <View style={styles.flashSaleLabel}>
            <Text style={styles.flashSaleText}>FRIDAY</Text>
          </View>
          <View style={styles.flashSaleLabel1}>
            <Text style={styles.flashSaleText}>Star Shop</Text>
          </View>
          <Text style={styles.productName}>{product.TenSP}</Text>
        </View>
        <Text style={styles.productName1}>Giới thiệu về sản phẩm này</Text>
        <View style={styles.descriptionContainer}>
          <ScrollView>
            <Text style={styles.productDescription}>{product.MoTa}</Text>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Pay Tabs */}
      <View style={styles.payTabs}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() =>
            checkLogin(() => Alert.alert("Chat", "Chức năng chat!"))
          }
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#e62e00"
          />
          <Text style={styles.tabText}>Chat ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() =>
            checkLogin(() => Alert.alert("Giỏ hàng", "Thêm vào giỏ hàng!"))
          }
        >
          <Ionicons name="cart-outline" size={24} color="#e62e00" />
          <Text style={styles.tabText}>Thêm giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() =>
            checkLogin(() => Alert.alert("Mua ngay", "Chức năng mua ngay!"))
          }
        >
          <Ionicons name="bag-handle-outline" size={24} color="white" />
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: screenWidth,
    height: 400,
    resizeMode: "cover",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 20,
    color: "black",
    fontFamily: "outfit-Bold",
  },
  productStock: {
    fontSize: 15,
    color: "#e62e00",
    fontFamily: "outfit",
  },
  flashSaleContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginHorizontal: 10,
    marginTop: -10,
  },
  flashSaleLabel: {
    backgroundColor: "#ffff00",
    padding: 5,
    width: 70,
    borderRadius: 5,
    marginLeft: 10,
  },
  flashSaleLabel1: {
    backgroundColor: "#ffe6cc",
    padding: 5,
    width: 70,
    borderRadius: 5,
    marginLeft: 10,
  },
  flashSaleText: {
    fontSize: 12,
    fontFamily: "outfit-Bold",
    textAlign: "center",
  },
  productName: {
    fontSize: 18,
    color: "black",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  productName1: {
    fontSize: 18,
    color: "black",
    marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 5,
    fontFamily: "outfit-Bold",
  },
  productDescription: {
    fontSize: 15,
    color: "black",
    textAlign: "justify",
    padding: 5,
  },
  payTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  chatButton: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  cartButton: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  buyButton: {
    flex: 2,
    backgroundColor: "#e62e00",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
  },
  tabText: {
    fontSize: 13,
    color: "black",
  },
  buyButtonText: {
    fontSize: 13,
    color: "white",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  descriptionContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    height: 120,
    marginHorizontal: 15,
  },
  headerStyle: {
    backgroundColor: "transparent",
  },
  headerLeft: {
    backgroundColor: "#f2f2f2",
    borderRadius: 99,
    padding: 10,
    opacity: 0.7,
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
    marginRight: 5,
  },
  headerIcon: {
    backgroundColor: "#f2f2f2",
    borderRadius: 99,
    padding: 10,
    opacity: 0.7,
  },
});
