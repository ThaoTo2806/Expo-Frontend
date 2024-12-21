import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ListSetting() {
  const navigation = useNavigation(); // Hook điều hướng

  const handleLogout = async () => {
    try {
      // Xóa toàn bộ dữ liệu trong AsyncStorage
      await AsyncStorage.clear();

      // Điều hướng về trang chính (index)
      navigation.navigate("index");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      Alert.alert("Đăng xuất thất bại", "Không thể xóa dữ liệu người dùng.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textCon}>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="card-outline" size={24} color="black" />
          <Text style={styles.iconText}>Ví điện tử</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textCon}>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="headset-outline" size={24} color="black" />
          <Text style={styles.iconText}>Trung tâm hỗ trợ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textCon}>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={styles.iconText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textCon}>
        <TouchableOpacity style={styles.iconItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.iconText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 6,
  },
  iconItem: {
    flexDirection: "row", // Đặt icon và text trên cùng một hàng
    alignItems: "center", // Căn giữa icon và text theo chiều dọc
    marginVertical: 8,
    borderBottomWidth: 1, // Thêm đường viền dưới mỗi dòng
    width: "98%",
    borderBottomColor: "#D3D3D3", // Màu xám cho đường viền
    paddingBottom: 8, // Khoảng cách giữa phần tử và gạch
  },
  iconText: {
    fontSize: 14,
    fontFamily: "outfit",
    marginLeft: 5, // Khoảng cách giữa icon và text
  },
  textCon: {
    flexDirection: "row", // Đảm bảo các phần tử trong textCon nằm ngang
  },
});
