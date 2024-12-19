import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import axios from "axios";

export default function ProductDetailById() {
  const navigation = useNavigation();
  const { MaSP } = useLocalSearchParams();

  // State để lưu trữ dữ liệu sản phẩm và trạng thái tải
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
    console.log("MaSP: ", MaSP);

    // Gọi API với MaSP
    if (MaSP) {
      axios
        .get(`http://192.168.1.8:5000/api/sanpham/${MaSP}`)
        .then((response) => {
          console.log("API Response: ", response.data); // Kiểm tra dữ liệu trả về từ API
          setProduct(response.data.data); // Truy cập đúng dữ liệu trả về
          setLoading(false); // Đổi trạng thái tải
        })
        .catch((error) => {
          console.error("Error fetching product data: ", error);
          setError("Không thể tải dữ liệu sản phẩm."); // Thông báo lỗi
          setLoading(false); // Đổi trạng thái tải
        });
    }
  }, [MaSP, navigation]);

  // Hiển thị loading hoặc thông báo lỗi nếu có
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

  // Hiển thị thông tin sản phẩm
  return (
    <View style={styles.container}>
      {product ? (
        <>
          <Text style={styles.productName}>{product.TenSP}</Text>
          <Text style={styles.productPrice}>Giá: {product.GiaBan}</Text>
          <Text style={styles.productDescription}>Mô tả: {product.MoTa}</Text>
          <Image style={styles.productImage} source={{ uri: product.Anh }} />
        </>
      ) : (
        <Text>Không tìm thấy sản phẩm.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  productDescription: {
    fontSize: 16,
    textAlign: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
