import { View, Text, Alert } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "./../../constants/Colors.ts";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Đảm bảo bạn đã cài AsyncStorage
import { useRouter } from "expo-router";

const TabLayout = () => {
  const router = useRouter();

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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons name="color-palette-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
        // Sử dụng tabPress để kiểm tra đăng nhập khi tab được chọn
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Ngừng chuyển tab trước khi kiểm tra đăng nhập
            checkLogin(() => {
              router.push("/profile"); // Sau khi đăng nhập, chuyển đến trang profile
            });
          },
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
