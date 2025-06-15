import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { colors } from "../../../constants";
import { LucideIcon } from "lucide-react-native";
import { UserResponse } from "@/model/User";

// Định nghĩa type cho props
interface UserProfileCardProps {
  user: UserResponse;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <View style={styles.Container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: `http://192.168.1.218:8080/api${user.avatarUrl}`,
          }}
          style={styles.avatarImage}
          onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{user.username}</Text>
        <Text style={styles.secondaryText}>{user.email}</Text>
      </View>
    </View>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatarContainer: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.primary_light,
    borderRadius: 20,
    padding: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Làm tròn thành hình tròn
    resizeMode: "cover", // Đảm bảo hình không bị méo
  },
  infoContainer: {
    width: "50%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: colors.light,
    paddingLeft: 10,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  secondaryText: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
