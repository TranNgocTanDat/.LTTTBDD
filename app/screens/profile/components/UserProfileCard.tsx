import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../constants";
import { LucideIcon } from "lucide-react-native";
import { UserResponse } from "@/model/User";

// Định nghĩa type cho props
interface UserProfileCardProps {
  Icon: LucideIcon;
  user: UserResponse;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  Icon,
  user
}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.avatarContainer}>
        <Icon color={colors.primary} size={80} />
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
    backgroundColor: colors.primary_light,
    borderRadius: 20,
    padding: 10,
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
