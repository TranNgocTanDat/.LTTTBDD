import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SectionHeader = ({ title }: { title: string }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
};

export default SectionHeader;

const styles = StyleSheet.create({
    header: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
        color: "#111827",
    },
});
