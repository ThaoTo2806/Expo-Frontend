import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPro from "../../components/Profile/HeaderPro";
import ListOrderStatus from "../../components/Profile/ListOrderStatus";
import ListSetting from "../../components/Profile/ListSetting";

const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderPro />
      <ListOrderStatus />
      <ListSetting />
    </SafeAreaView>
  );
};

export default Profile;
