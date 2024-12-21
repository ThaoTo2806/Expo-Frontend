import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ListOrderStatus() {
  return (
    <View style={styles.container}>
      <View style={styles.textCon}>
        <Text style={styles.wel}>Đơn hàng</Text>
        <TouchableOpacity style={styles.textCon1}>
          <Text style={styles.wel1}>Lịch sử đặt hàng </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Các TouchableOpacity với icon và text */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="bag-handle-outline" size={24} color="black" />
          <Text style={styles.iconText}>Chờ xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="bag-check-outline" size={24} color="black" />
          <Text style={styles.iconText}>Chờ lấy hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="bicycle-outline" size={24} color="black" />
          <Text style={styles.iconText}>Chờ giao hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconItem}>
          <Ionicons name="star-outline" size={24} color="black" />
          <Text style={styles.iconText}>Đánh giá</Text>
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
  wel: {
    fontSize: 13,
    fontFamily: "outfit",
    flex: 1,
    marginLeft: 10,
  },
  wel1: {
    fontSize: 13,
    fontFamily: "outfit",
  },
  textCon: {
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "flex-end",
    width: "98%",
  },
  textCon1: {
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Chia đều các item
    marginTop: 10, // Khoảng cách giữa phần trên và dưới
  },
  iconItem: {
    alignItems: "center", // Đảm bảo các icon và text nằm cùng nhau
  },
  iconText: {
    fontSize: 13,
    fontFamily: "outfit",
    marginTop: 5, // Khoảng cách giữa icon và text
  },
});
