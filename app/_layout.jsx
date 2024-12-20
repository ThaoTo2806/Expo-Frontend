import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-Bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ title: "Đăng Nhập" }} />
      <Stack.Screen
        name="pdt/[MaSP]"
        options={{ title: "Chi Tiết Sản Phẩm" }}
      />
    </Stack>
  );
}
