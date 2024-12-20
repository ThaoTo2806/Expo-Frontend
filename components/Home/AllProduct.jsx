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
import axios from "axios"; // Import Axios để gọi API
import { Colors } from "../../constants/Colors"; // Thêm Colors nếu cần
import { useRouter } from "expo-router";
import ProductItem from "./ProductItem";

export default function AllProduct() {
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải
  const [showAll, setShowAll] = useState(false); // State để theo dõi việc hiển thị tất cả sản phẩm hay chỉ 6 sản phẩm
  const router = useRouter();

  // useEffect để gọi API khi component được render
  useEffect(() => {
    // Gọi API lấy dữ liệu sản phẩm
    axios
      .get("http://192.168.1.8:5000/api/sanpham")
      .then((response) => {
        setProducts(response.data.data); // Lưu dữ liệu sản phẩm vào state
        setLoading(false); // Đánh dấu đã tải xong
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm: ", error);
        setLoading(false); // Kết thúc quá trình tải
      });
  }, []); // Chạy một lần khi component mount

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  // Hàm để hiển thị tất cả sản phẩm hoặc chỉ 6 sản phẩm đầu tiên
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
        data={displayedProducts} // Dữ liệu sản phẩm theo số lượng hiển thị
        numColumns={2} // Hiển thị theo 2 cột
        renderItem={({ item, index }) => (
          <View style={styles.productItem}>
            <Image style={styles.productImage} source={{ uri: item.Anh }} />
            <Text style={styles.productText}>{item.TenSP}</Text>
            {/* <Button title="Xem chi tiết" onPress={() => onProductPress(item)} /> */}
            <ProductItem
              product={item}
              key={index}
              onProductPress={(product) => router.push("/pdt/" + item.MaSP)}
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
    alignItems: "center", // Canh giữa các phần tử trong item
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
