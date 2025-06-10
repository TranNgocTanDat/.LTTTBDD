import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../../constants";

interface ItemType {
  orderId: string | number;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
  items: Array<{
    price: number;
    quantity: number;
  }>;
  status: string;
}

interface OrderListProps {
  item: ItemType;
  onPress: () => void;
}

function getTime(date: string): string {
  let t = new Date(date);
  const hours = ("0" + t.getHours()).slice(-2);
  const minutes = ("0" + t.getMinutes()).slice(-2);
  const seconds = ("0" + t.getSeconds()).slice(-2);
  const timeString = `${hours}:${minutes}:${seconds}`;

  const timeMatch = timeString.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [timeString];

  if (timeMatch.length > 1) {
    const parts = timeMatch.slice(1);
    parts[5] = +parts[0] < 12 ? " AM" : " PM"; // Set AM/PM
    parts[0] = String((+parts[0] % 12) || 12); // Adjust hours, ép sang string
    return parts.join("");
  }

  return timeString;
}



const dateFormat = (datex: string): string => {
  let t = new Date(datex);
  const date = ("0" + t.getDate()).slice(-2);
  const month = ("0" + (t.getMonth() + 1)).slice(-2);
  const year = t.getFullYear();
  // const hours = ("0" + t.getHours()).slice(-2);
  // const minutes = ("0" + t.getMinutes()).slice(-2);
  // const seconds = ("0" + t.getSeconds()).slice(-2);
  const newDate = `${date}-${month}-${year}`;

  return newDate;
};

const OrderList: React.FC<OrderListProps> = ({ item, onPress }) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    let packageItems = 0;
    item?.items.forEach(() => {
      ++packageItems;
    });
    setQuantity(packageItems);
    setTotalCost(
      item?.items.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity;
      }, 0)
    );
  }, [item]);

  return (
    <View style={styles.container}>
      <View style={styles.innerRow}>
        <View>
          <Text style={styles.primaryText}>Order # {item?.orderId}</Text>
        </View>
        <View style={styles.timeDateContainer}>
          <Text style={styles.secondaryTextSm}>{dateFormat(item?.createdAt)}</Text>
          <Text style={styles.secondaryTextSm}>{getTime(item?.createdAt)}</Text>
        </View>
      </View>
      {item?.user?.name && (
        <View style={styles.innerRow}>
          <Text style={styles.secondaryText}>{item?.user?.name} </Text>
        </View>
      )}
      {item?.user?.email && (
        <View style={styles.innerRow}>
          <Text style={styles.secondaryText}>{item?.user?.email} </Text>
        </View>
      )}
      <View style={styles.innerRow}>
        <Text style={styles.secondaryText}>Quantity : {quantity}</Text>
        <Text style={styles.secondaryText}>Total Amount : {totalCost}$</Text>
      </View>
      <View style={styles.innerRow}>
        <TouchableOpacity style={styles.detailButton} onPress={onPress}>
          <Text>Details</Text>
        </TouchableOpacity>
        <Text style={styles.secondaryText}>{item?.status}</Text>
      </View>
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "auto",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  innerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  primaryText: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: "bold",
  },
  secondaryTextSm: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "bold",
  },
  timeDateContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  detailButton: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: colors.muted,
    color: colors.muted,
    width: 100,
  },
});
