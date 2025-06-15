import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
    icon: string;
    label: string;
    value: string;
}

const StatsCard: React.FC<Props> = ({ icon, label, value }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

export default StatsCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#e0f2fe",
        padding: 16,
        borderRadius: 10,
        width: 160,
        alignItems: "center",
    },
    icon: {
        fontSize: 24,
        marginBottom: 6,
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e3a8a",
    },
    label: {
        color: "#374151",
        fontSize: 14,
    },
});
