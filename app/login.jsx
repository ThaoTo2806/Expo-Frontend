import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onLoginPress = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.8:5000/api/khachhang/dangnhap",
        {
          username,
          password,
        }
      );

      // Xử lý nếu đăng nhập thành công
      const data = response.data;
      //console.log("Response data:", data);
      if (data.success) {
        // Lưu token và thông tin người dùng vào AsyncStorage
        const userInfo = {
          token: data.accessToken, // token từ API
          user: data.data, // thông tin người dùng
        };

        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error: ", error);
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/premium-photo/red-white-abstract-background-indonesia-pattern_773912-22.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Tiêu đề */}
        <Text style={styles.title}>ĐĂNG NHẬP</Text>

        {/* Input Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>

        {/* Input Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Checkbox Hiển thị mật khẩu và Quên mật khẩu */}

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
        </TouchableOpacity>

        {/* Button Login */}
        <TouchableOpacity style={styles.btn} onPress={onLoginPress}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        {/* Đăng ký tài khoản */}
        <View style={styles.options}>
          <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity>
            <Text style={styles.registerText1}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-Bold",
    color: "#e60000",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#000",
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: "outfit",
  },
  options: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#e60000",
    marginBottom: 10,
    textAlign: "right",
  },
  btn: {
    backgroundColor: "#ff8080",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-Bold",
  },
  registerText: {
    fontSize: 16,
    fontFamily: "outfit",
    textAlign: "center",
  },
  registerText1: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: "#e60000",
    textAlign: "center",
  },
});
