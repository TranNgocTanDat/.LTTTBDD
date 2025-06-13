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
  Platform,
  SafeAreaView,
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
  categories: { user: UserResponse; categoryID?: string };
  myorder: { user: UserResponse };
  user: { user: UserResponse };
};

type Props = BottomTabScreenProps<TabParamList, "home">;

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

type Item = {
  id: string;
  name: string;
};

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
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>(
    []
  );
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

  const handleProductPress = (product: ProductResponse) => {
    // navigation.navigate("productdetail", { product });
  };

  const handleAddToCart = (productId: number) => {
    if (!authenticated) {
      alert("Please log in to add items to your cart.");
      return;
    }
    addToCart({ productId });
  };

  const fetchProduct = () => {
    fetch(`${network.serverip}/products`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          setFilteredProducts(result.data);
          setError("");
        } else {
          setError(result.message);
        }
      })
      .catch((err) => {
        setError(err.message);
        console.log("error", err);
      });
  };

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
      setFilteredProducts(
        products.filter((p) => p.productName.toLowerCase().includes(lower))
      );
    }
  }, [searchQuery, products]);

  const searchItems = [
    { id: "1", name: "PlayStation 5" },
    { id: "2", name: "Xbox Series X" },
    { id: "3", name: "Nintendo Switch" },
  ];

  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setFilteredData([]);
      setShowDropdown(false);
      return;
    }

    const filtered = searchItems.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setShowDropdown(true);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() => navigation.getParent()?.navigate("cart")}>
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#9A9A9A" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products"
                value={query}
                onChangeText={handleSearch}
              />
            </View>

            {showDropdown && (
              <FlatList
                style={styles.dropdownList}
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setQuery(item.name);
                      setShowDropdown(false);
                      // handleProductPress(item); // xử lý chọn item
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.cartIconContainer}
                onPress={() => navigation.getParent()?.navigate("cart")}
            >
              {cartItems.length > 0 && (
                  <View style={styles.cartItemCountContainer}>
                    <Text style={styles.cartItemCountText}>{cartItems.length}</Text>
                  </View>
              )}
              <Image source={cartIcon} />
            </TouchableOpacity>

          </View>
        </View>
      <View style={styles.bodyContainer}>
        <ScrollView  nestedScrollEnabled={true} >
          <View style={styles.promotiomSliderContainer}>
            <Carousel
              width={300}
              height={200}
              loop
              autoPlay
              data={slides}
              scrollAnimationDuration={1000}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => console.log("Image pressed", index)}
                >
                  <Image
                    source={item} // <-- sửa ở đây
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 10,
                    }}
                    resizeMode="contain"
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
                    image={item.image}
                    onPress={function (): void {
                      throw new Error("Function not implemented.");
                    }} // onPress={() =>
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
                  <RefreshControl
                    refreshing={refeshing}
                    onRefresh={handleOnRefresh}
                  />
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
    </SafeAreaView>
  );
};

export default HomeScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBarContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  topbarlogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 6,
  },
  toBarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bodyContainer: {
    flex: 1,
    width: "100%",
  },
  searchContainer: {
    top: Platform.OS === "android" ? 55 : 45,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "#fff",
  },
  searchWrapper: {
    flex: 1,
    marginRight: 10,
    position: "relative",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#000",
  },
  dropdownList: {
    position: "absolute",
    top: 48,
    width: "100%",
    backgroundColor: "white",
    borderColor: "#E5E5EA",
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cartIconContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cartItemCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  promotiomSliderContainer: {
    marginTop: 100, // đảm bảo dưới phần search
    marginHorizontal: 10,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  primaryTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  categoryContainer: {
    paddingLeft: 10,
    paddingVertical: 10,
  },
  flatListContainer: {
    height: 60,
  },
  emptyView: {
    width: 30,
  },
  productCardContainer: {
    paddingLeft: 10,
    paddingBottom: 20,
    paddingTop: 5,
  },
  productCardContainerEmpty: {
    justifyContent: "center",
    alignItems: "center",
    height: 240,
    paddingHorizontal: 20,
  },
  productCardContainerEmptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#999",
    fontWeight: "600",
  },
});