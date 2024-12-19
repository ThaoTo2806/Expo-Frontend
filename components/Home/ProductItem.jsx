import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";

export default function ProductItem({ product, onProductPress }) {
  return (
    <TouchableOpacity
      onPress={() => onProductPress(product)}
      style={styles.button}
    >
      <Text style={styles.textC}>XEM CHI TIẾT</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#99ccff", // Màu nền giống button
    paddingVertical: 10, // Khoảng cách trên và dưới
    paddingHorizontal: 20, // Khoảng cách trái và phải
    borderRadius: 25, // Góc bo tròn
    alignItems: "center", // Căn giữa nội dung
    justifyContent: "center", // Căn giữa nội dung
  },
  textC: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "white",
    textAlign: "center",
  },
});
