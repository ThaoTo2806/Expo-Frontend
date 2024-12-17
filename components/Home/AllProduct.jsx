import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function AllProduct() {
  return (
    <View>
      <View>
        <Text style={styles.name}>List Products</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    fontFamily: "outfit-Bold",
    paddingLeft: 15,
    paddingTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
});
