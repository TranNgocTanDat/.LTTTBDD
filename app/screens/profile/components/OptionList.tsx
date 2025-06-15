import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../constants";
import { LucideIcon } from "lucide-react-native";

// Enum type cho OptionList
export enum OptionListType {
  Default = "default",
  Modern = "modern",
}

// Props Interface
interface OptionListProps {
  Icon: LucideIcon; // Hỗ trợ các thư viện icon như Ionicons, FontAwesome...
  iconName: string;
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
  type?: OptionListType;
  onPressSecondary?: (event: GestureResponderEvent) => void;
}

const OptionList: React.FC<OptionListProps> = ({
  Icon,
  iconName,
  text,
  onPress,
  type = OptionListType.Default,
  onPressSecondary,
}) => {
  if (type === OptionListType.Modern) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white }]}>
        <View style={styles.iconTextContainer}>
          <Icon size={24} color={colors.primary} />
          <Text style={styles.listText}>{text}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {onPressSecondary && (
            <TouchableOpacity style={styles.actionButton} onPress={onPressSecondary}>
              <Icon  size={15} color={colors.white} />
            </TouchableOpacity>
          )}
          {onPress && (
            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <Icon  size={15} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Default style
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconTextContainer}>
        <Icon  size={24} color={colors.primary} />
        <Text style={styles.listText}>{text}</Text>
      </View>
      <MaterialIcons name="arrow-forward-ios" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

export default OptionList;

// Styles
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 10,
    elevation: 5,
    marginBottom: 15,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    height: 30,
    width: 30,
    backgroundColor: colors.primary,
    borderRadius: 5,
    elevation: 2,
  },
});
