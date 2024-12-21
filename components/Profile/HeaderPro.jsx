import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function HeaderPro() {
  // Tạo state để lưu userInfo
  const [userInfo, setUserInfo] = useState(null);

  // Sử dụng useEffect để lấy userInfo khi component được render
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoData = await AsyncStorage.getItem("userInfo");
        if (userInfoData !== null) {
          // Chuyển đổi userInfo thành object nếu cần
          setUserInfo(JSON.parse(userInfoData));
        }
      } catch (error) {
        console.error("Error checking login status: ", error);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
      }
    };

    fetchUserInfo();
  }, []);

  // Kiểm tra nếu userInfo chưa được tải
  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent={false}
          style="light"
          backgroundColor={Colors.PRIMARY}
        />
        <View style={styles.header}>
          <Text style={styles.name}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={false}
        style="light"
        backgroundColor={Colors.PRIMARY}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.btn}>
          <Image
            source={{
              uri: "https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Hinh-dai-dien-hai-huoc-cam-dep-duoi-ai-do.jpg?1704789789335",
            }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.welcome}>{userInfo.user.HoTen}</Text>
            <Text style={styles.name}>{userInfo.user.Email}</Text>
          </View>
          <FontAwesome name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  welcome: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: "#fff",
  },
  name: {
    fontFamily: "outfit",
    color: "#fff",
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    flexDirection: "row", // Đảm bảo các phần tử trong TouchableOpacity nằm trên cùng một hàng
    alignItems: "center", // Căn giữa theo chiều dọc
    width: "100%", // Đảm bảo btn chiếm hết chiều rộng của container
  },
  textContainer: {
    marginLeft: 10, // Khoảng cách giữa hình ảnh và văn bản
    flex: 1, // Đảm bảo phần text chiếm không gian còn lại
  },
  icon: {
    marginLeft: 10, // Khoảng cách giữa văn bản và icon
  },
});
