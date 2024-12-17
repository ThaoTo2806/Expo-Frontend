import { ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import AllProduct from "../../components/Home/AllProduct";
const Home = () => {
  return (
    <SafeAreaView>
      {/* Header */}
      <Header />
      <ScrollView>
        {/* Slider */}
        <Slider />
        {/*All Products*/}
        <AllProduct />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
