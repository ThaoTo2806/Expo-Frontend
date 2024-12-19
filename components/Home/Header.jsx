import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Header() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={false}
        style="light"
        backgroundColor={Colors.PRIMARY}
      />
      <View style={styles.header}>
        <View style={styles.search}>
          <Ionicons name="search" size={24} color={Colors.PRIMARY} />
          <TextInput placeholder="Search..." style={styles.textS} />
        </View>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="cart-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="#fff" />
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
    gap: 10,
    padding: 10,
  },
  search: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    width: 300,
  },
  textS: {
    fontFamily: "outfit",
    fontSize: 16,
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    marginTop: -5,
  },
});
