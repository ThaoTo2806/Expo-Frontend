import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  CheckBox,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../constants/Colors";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onLoginPress = () => {
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Login</Text>

      {/* Input Username */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Input Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Checkbox để hiển thị mật khẩu */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={passwordVisible}
          onValueChange={togglePasswordVisibility}
        />
        <Text style={styles.checkboxLabel}>Show Password</Text>
      </View>

      {/* Nút Login */}
      <TouchableOpacity style={styles.btn} onPress={onLoginPress}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Canh giữa theo chiều dọc
    alignItems: "center", // Canh giữa theo chiều ngang
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-Bold",
    marginBottom: 20,
    color: Colors.PRIMARY,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  label: {
    width: 80,
    fontSize: 16,
    fontFamily: "outfit",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "outfit",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  checkboxLabel: {
    fontSize: 15,
    fontFamily: "outfit",
    marginLeft: 8,
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 99,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-Bold",
  },
});
