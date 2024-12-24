import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../frontend/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CheckBox from "react-native-check-box";

export default function Cart() {
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [distinctProductCount, setDistinctProductCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: Colors.PRIMARY },
      headerTintColor: "white",
      headerTitle: `Cart (${distinctProductCount})`,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={navigation.goBack}
        >
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [distinctProductCount]);

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

  const fetchCartData = async () => {
    try {
      if (!token) return;
      const response = await axios.get("http://192.168.1.8:5000/api/giohang", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCartItems(response.data.cart);
        setDistinctProductCount(response.data.distinctProductCount);
        setTotalAmount(response.data.totalAmount);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [token]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put(
        `http://192.168.1.8:5000/api/giohang/${productId}`,
        { SoLuong: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchCartData();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteProductFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `http://192.168.1.8:5000/api/giohang/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchCartData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <CheckBox
        style={styles.checkbox}
        isChecked={isChecked}
        onClick={() => setIsChecked(!isChecked)}
        checkBoxColor={Colors.PRIMARY} // Màu sắc checkbox
      />
      <Image source={{ uri: item.Anh }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.TenSP}</Text>
        <Text style={styles.productPrice}>
          {item.GiaBan.toLocaleString()} ₫
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              item.SoLuong > 0 && updateQuantity(item.MaSP, item.SoLuong - 1)
            }
          >
            <Ionicons name="remove" size={18} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={item.SoLuong.toString()}
            editable={false}
          />
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.MaSP, item.SoLuong + 1)}
          >
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>

          {/* Đẩy nút "cut" về bên phải */}
          <TouchableOpacity
            style={[styles.quantityButton, { marginLeft: "auto" }]}
            onPress={() => deleteProductFromCart(item.MaSP)}
          >
            <Ionicons name="cut" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.MaSP.toString()}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Total: {totalAmount.toLocaleString()} ₫
        </Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  headerButton: { padding: 10 },
  cartList: { padding: 16 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  checkbox: { marginRight: 10 },
  productImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  itemDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  productPrice: { fontSize: 14, color: "gray", marginBottom: 8 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  quantityButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 5,
  },
  quantityInput: {
    width: 40,
    textAlign: "center",
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 18, fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
