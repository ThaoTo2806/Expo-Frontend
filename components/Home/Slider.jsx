import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import Banner1 from "../../assets/images/Banner/Banner1.png";
import Banner2 from "../../assets/images/Banner/Banner2.png";
import Banner3 from "../../assets/images/Banner/Banner3.png";
import Banner4 from "../../assets/images/Banner/Banner4.png";

const Slider = () => {
  const banners = [
    { id: "1", imageUrl: Banner1 },
    { id: "2", imageUrl: Banner2 },
    { id: "3", imageUrl: Banner3 },
    { id: "4", imageUrl: Banner4 },
  ];

  const flatListRef = useRef(null); // Tạo tham chiếu cho FlatList
  const [currentIndex, setCurrentIndex] = useState(0); // State lưu index hiện tại

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === banners.length - 1 ? 0 : prevIndex + 1;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Thời gian chuyển slider (3 giây)

    return () => clearInterval(interval); // Cleanup interval khi unmount
  }, []);

  return (
    <View>
      <Text style={styles.name}>#Special for you</Text>
      <FlatList
        ref={flatListRef}
        style={styles.sliders}
        horizontal={true} // Hiển thị danh sách theo chiều ngang
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
        data={banners} // Dữ liệu cần hiển thị, ở đây là mảng `banners`
        keyExtractor={(item) => item.id} // Khóa duy nhất cho từng phần tử
        renderItem={({ item }) => (
          <Image style={styles.images} source={item.imageUrl} />
        )}
        getItemLayout={(data, index) => ({
          length: 265, // Độ rộng của mỗi item (250px + 15px marginRight)
          offset: 265 * index,
          index,
        })}
        scrollEventThrottle={16}
        pagingEnabled
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    fontFamily: "outfit-Bold",
    paddingLeft: 15,
    paddingTop: 15,
    marginBottom: 5,
  },
  images: {
    width: 250,
    height: 150,
    resizeMode: "cover", // Đảm bảo hình ảnh được căn chỉnh đẹp
    borderRadius: 15,
    marginRight: 15,
  },
  sliders: {
    paddingLeft: 15,
  },
});
