import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import AllProduct from "../../components/Home/AllProduct";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Slider />
      <AllProduct />
    </SafeAreaView>
  );
};

export default Home;
