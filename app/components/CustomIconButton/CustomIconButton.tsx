import { StyleSheet, Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { colors } from "../../constants";

interface CustomIconButtonProps {
  text: string;
  image: ImageSourcePropType;
  onPress: () => void;
  active?: boolean;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  text,
  image,
  onPress,
  active = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: active ? colors.primary_light : colors.white },
      ]}
      onPress={onPress}
    >
      <Image source={image} style={styles.buttonIcon} />
      <Text
        style={[
          styles.buttonText,
          { color: active ? colors.dark : colors.muted },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 40,
    width: 110,
    elevation: 3,
    margin: 5,
  },
  buttonText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "bold",
  },
  buttonIcon: {
    height: 20,
    width: 35,
    resizeMode: "contain",
  },
});
