import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import StepIndicator from "react-native-step-indicator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";
import { RootStackParamList } from "@/routes/Routers";

// Định nghĩa interface cho các product item trong order
interface OrderItem {
  productId: {
    title: string;
  };
  price: number;
  quantity: number;
}

// Định nghĩa interface Order tương ứng với dữ liệu orderDetail
export interface Order {
  orderId: string | number;
  status: string;
  country: string;
  city: string;
  shippingAddress: string;
  zipcode?: string;
  updatedAt: string;
  shippedOn?: string;
  deliveredOn?: string;
   createdAt: string;
  items: OrderItem[];
}



type Props = NativeStackScreenProps<RootStackParamList, "myorderdetail">;


const MyOrderDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderDetail } = route.params;

  const [isloading, setIsloading] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("Loading..");
  const [error, setError] = useState<string>("");
  const [alertType, setAlertType] = useState<"error" | "success" >("error");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);
  const [statusDisable, setStatusDisable] = useState<boolean>(false);
  const [trackingState, setTrackingState] = useState<number>(1);

  const labels = ["Processing", "Shipping", "Delivery"];

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.primary,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#fe7013",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#fe7013",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: colors.white,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "#fe7013",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#fe7013",
  };

  // Chuyển thời gian sang AM/PM format
  function tConvert(time: string) {
    const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/);
    if (!match) return time;
    let [_, hh, mm, ss] = match;
    const hours = parseInt(hh, 10);
    const ampm = hours < 12 ? "AM" : "PM";
    const h = hours % 12 || 12;
    return `${h}:${mm}${ampm}`;
  }

  // Chuyển date sang dd-mm-yyyy, time AM/PM format
  const dateFormat = (datex: string) => {
    const t = new Date(datex);
    const date = ("0" + t.getDate()).slice(-2);
    const month = ("0" + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    const hours = ("0" + t.getHours()).slice(-2);
    const minutes = ("0" + t.getMinutes()).slice(-2);
    const seconds = ("0" + t.getSeconds()).slice(-2);
    const time = tConvert(`${hours}:${minutes}:${seconds}`);
    return `${date}-${month}-${year}, ${time}`;
  };

  useEffect(() => {
    setError("");
    setAlertType("error");
    setStatusDisable(orderDetail?.status === "delivered");
    setValue(orderDetail?.status);
    setAddress(
      `${orderDetail?.country}, ${orderDetail?.city}, ${orderDetail?.shippingAddress}`
    );

    // Tính tổng tiền: Lưu ý sửa lỗi tính toán sai (phải cộng tích quantity * price chứ không phải cộng rồi nhân)
    const total = orderDetail?.items.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);
    setTotalCost(total);

    if (orderDetail?.status === "pending") {
      setTrackingState(1);
    } else if (orderDetail?.status === "shipped") {
      setTrackingState(2);
    } else {
      setTrackingState(3);
    }
  }, [orderDetail]);

  return (
    <View style={styles.container}>
      <Spinner
        visible={isloading}
        textContent="Please wait..."
        textStyle={{ color: "#FFF" }}
      />
      <StatusBar />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Order Details</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            View all detail about order
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>Shipping Address</Text>
          </View>
        </View>
        <View style={styles.ShipingInfoContainer}>
          <Text style={styles.secondarytextSm}>{address}</Text>
          <Text style={styles.secondarytextSm}>{orderDetail?.zipcode}</Text>
        </View>
        <View>
          <Text style={styles.containerNameText}>Order Info</Text>
        </View>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.secondarytextMedian}>
            Order # {orderDetail?.orderId}
          </Text>
          <Text style={styles.secondarytextSm}>
            Ordered on {dateFormat(orderDetail?.updatedAt)}
          </Text>
          {orderDetail?.shippedOn && (
            <Text style={styles.secondarytextSm}>
              Shipped on {orderDetail?.shippedOn}
            </Text>
          )}
          {orderDetail?.deliveredOn && (
            <Text style={styles.secondarytextSm}>
              Delivered on {orderDetail?.deliveredOn}
            </Text>
          )}
          <View style={{ marginTop: 15, width: "100%" }}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={trackingState}
              stepCount={3}
              labels={labels}
            />
          </View>
        </View>

        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>Package Details</Text>
          </View>
        </View>
        <View style={styles.orderItemsContainer}>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Package</Text>
            <Text>{value}</Text>
          </View>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>
              Order on : {orderDetail?.updatedAt}
            </Text>
          </View>
          <ScrollView
            style={styles.orderSummaryContainer}
            nestedScrollEnabled={true}
          >
            {orderDetail?.items.map((product, index) => (
              <View key={index}>
                <BasicProductList
                  title={product?.productId?.title}
                  price={product?.price}
                  quantity={product?.quantity}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Total</Text>
            <Text>{totalCost}$</Text>
          </View>
        </View>
        <View style={styles.emptyView} />
      </ScrollView>
    </View>
  );
};

export default MyOrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
  },
  bodyContainer: { flex: 1, width: "100%", padding: 5 },
  ShipingInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 5,
    marginBottom: 10,
  },
  containerNameContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.muted,
  },
  secondarytextSm: {
    color: colors.muted,
    fontSize: 13,
  },
  orderItemsContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 3,
    marginBottom: 10,
  },
  orderItemContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 13,
    color: colors.muted,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
    width: "100%",
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    width: "110%",
    height: 70,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
  orderInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 1,
    marginBottom: 10,
  },
  primarytextMedian: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  secondarytextMedian: {
    color: colors.muted,
    fontSize: 15,
  },
  emptyView: {
    height: 150,
  },
});
