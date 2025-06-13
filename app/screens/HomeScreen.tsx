import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import cartIcon from "../assets/icons/cart_beg.png";
import scanIcon from "../assets/icons/scan_icons.png";
import easybuylogo from "../assets/logo/logo.png";
import { colors } from "../constants";
import { network } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cartApi from "@/services/cartApi";
import { addCartItem } from "@/redux/cartSlice";
import { RootState } from "@/redux/store";
import { ProductResponse } from "@/model/Product";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomIconButton from "@/components/CustomIconButton/CustomIconButton";
import ProductCard from "@/components/ProductCard/ProductCard";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { UserResponse } from "@/model/User";
import { Dropdown } from "react-native-element-dropdown";
import Carousel from "react-native-reanimated-carousel";

type TabParamList = {
  home: { user: UserResponse };
  categories: {user:UserResponse, categoryID?: string };
  myorder: { user: UserResponse };
  user: { user: UserResponse };
};

type Props = BottomTabScreenProps<TabParamList, 'home'>;

const slides = [
  require("../assets/image/banners/banner.png"),
  require("../assets/image/banners/banner.png"),
];

const category = [
  {
    productId: "62fe244f58f7aa8230817f89",
    title: "Garments",
    image: require("../assets/icons/garments.png"),
  },
  {
    productId: "62fe243858f7aa8230817f86",
    title: "Electornics",
    image: require("../assets/icons/electronics.png"),
  },
  {
    productId: "62fe241958f7aa8230817f83",
    title: "Cosmentics",
    image: require("../assets/icons/cosmetics.png"),
  },
  {
    productId: "62fe246858f7aa8230817f8c",
    title: "Groceries",
    image: require("../assets/icons/grocery.png"),
  },
];

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { user } = route.params;
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [value, setValue] = useState(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [refeshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);
  const carouselRef = useRef<ScrollView>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { mutate: addToCart } = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => {
      dispatch(addCartItem(data));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      console.error("Add to cart failed", err);
    },
  });

  const convertToJSON = (obj: string | any) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch {
      setUserInfo(obj);
    }
  };

  // const handleProductPress = (product: ProductResponse) => {
  //   navigation.navigate("productdetail", { product });
  // };

  const handleAddToCart = (productId: number) => {
    if (!authenticated) {
      alert("Please log in to add items to your cart.");
      return;
    }
    addToCart({ productId });
  };

  // const fetchProduct = () => {
  //   fetch(`${network.serverip}/products`)
  //     .then((res) => res.json())
  //     .then((result) => {
  //       if (result.success) {
  //         setProducts(result.data);
  //         setFilteredProducts(result.data);
  //         setError("");
  //       } else {
  //         setError(result.message);
  //       }
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       console.log("error", err);
  //     });
  // };

  const handleOnRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  useEffect(() => {
    convertToJSON(user);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (carouselIndex + 1) % slides.length;
      carouselRef.current?.scrollTo({ x: nextIndex * 300, animated: true });
      setCarouselIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselIndex]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredProducts(products.filter(p => p.productName.toLowerCase().includes(lower)));
    }
  }, [searchQuery, products]);

  const searchItems = [
    { id: '1', name: 'PlayStation 5' },
    { id: '2', name: 'Xbox Series X' },
    { id: '3', name: 'Nintendo Switch' },
  ];

  function handleProductPress(item: any) {
    throw new Error("Function not implemented.");
  }

  return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.topBarContainer}>
          <TouchableOpacity disabled>
            <Ionicons name="menu" size={30} color={colors.muted} />
          </TouchableOpacity>
          <View style={styles.topbarlogoContainer}>
            <Image source={easybuylogo} style={styles.logo} />
            <Text style={styles.toBarText}>EasyBuy</Text>
          </View>
          <TouchableOpacity
              style={styles.cartIconContainer}
              onPress={() => navigation.navigate("cart")}
          >
            {cartItems.length > 0 && (
                <View style={styles.cartItemCountContainer}>
                  <Text style={styles.cartItemCountText}>{cartItems.length}</Text>
                </View>
            )}
            <Image source={cartIcon} resizeMode="contain" />
          </TouchableOpacity>

        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <Dropdown
                  style={{
                    height: 50,
                    borderColor: colors.muted,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    backgroundColor: colors.white,
                  }}
                  placeholderStyle={{ color: colors.muted }}
                  selectedTextStyle={{ color: colors.primary }}
                  inputSearchStyle={{
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: colors.light,
                    paddingHorizontal: 10,
                  }}
                  itemTextStyle={{ color: colors.muted }}
                  containerStyle={{
                    backgroundColor: colors.white,
                    borderRadius: 8,
                  }}
                  data={searchItems}
                  search
                  maxHeight={300}
                  labelField="name"     // tên field hiển thị
                  valueField="id"       // field là giá trị
                  placeholder="Search..."
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(item) => {
                    setValue(item.id);
                    handleProductPress(item); // giống như onItemSelect
                  }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.scanButton}>
                <Text style={styles.scanButtonText}>Scan</Text>

                <Image source={scanIcon} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView nestedScrollEnabled={true}>
            <View style={styles.promotiomSliderContainer}>
              <Carousel
                  width={200}
                  height={200}
                  loop
                  autoPlay
                  data={slides}
                  scrollAnimationDuration={1000}
                  renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => console.log("Image pressed", index)}>
                        <Image
                            source={{ uri: item }}
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 10,
                            }}
                            resizeMode="cover"
                        />
                      </TouchableOpacity>
                  )}
              />
            </View>
            <View style={styles.primaryTextContainer}>
              <Text style={styles.primaryText}>Categories</Text>
            </View>
            <View style={styles.categoryContainer}>
              <FlatList
                  showsHorizontalScrollIndicator={false}
                  style={styles.flatListContainer}
                  horizontal={true}
                  data={category}
                  keyExtractor={(item) => item.productId}
                  renderItem={({ item, index }) => (
                      <View style={{ marginBottom: 10 }} key={item.productId}>
                        <CustomIconButton
                            key={item.productId}
                            text={item.title}
                            image={item.image} onPress={function (): void {
                          throw new Error("Function not implemented.");
                        } }                    // onPress={() =>
                            //   navigation.jumpTo("categories", { categoryID: item })
                            // }
                        />
                      </View>
                  )}
              />
              <View style={styles.emptyView}></View>
            </View>
            <View style={styles.primaryTextContainer}>
              <Text style={styles.primaryText}>New Arrivals</Text>
            </View>
            {products.length === 0 ? (
                <View style={styles.productCardContainerEmpty}>
                  <Text style={styles.productCardContainerEmptyText}>
                    No Product
                  </Text>
                </View>
            ) : (
                <View style={styles.productCardContainer}>
                  <FlatList
                      refreshControl={
                        <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
                      }
                      showsHorizontalScrollIndicator={false}
                      initialNumToRender={5}
                      horizontal={true}
                      data={products.slice(0, 4)}
                      keyExtractor={(item) => item.productId.toString()}
                      renderItem={({ item, index }) => (
                          <View
                              key={item.productId}
                              style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                          >
                            <ProductCard
                                name={item.productName}
                                image={`${network.serverip}/uploads/${item.img}`}
                                price={item.price}
                                quantity={item.stock}
                                onPress={() => handleProductPress(item)}
                                onPressSecondary={() => handleAddToCart(item.productId)}
                            />
                          </View>
                      )}
                  />
                  <View style={styles.emptyView}></View>
                </View>
            )}
          </ScrollView>
        </View>
      </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // flexDirection: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  topbarlogoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  bodyContainer: {
    width: "100%",
    // flexDirection: "row",
    paddingBottom: 0,
    flex: 1,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  secondaryText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  searchContainer: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputContainer: {
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 40,
    width: "100%",
  },
  scanButtonText: {
    fontSize: 15,
    color: colors.light,
    fontWeight: "bold",
  },
  primaryTextContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatListContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  promotiomSliderContainer: {
    margin: 5,
    height: 140,
    backgroundColor: colors.light,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 60,
    marginLeft: 10,
  },
  emptyView: { width: 30 },
  productCardContainer: {
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmpty: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
});