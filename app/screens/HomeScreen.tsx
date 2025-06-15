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
import React, { useCallback, useEffect, useRef, useState } from "react";
import cartIcon from "../assets/icons/cart_beg.png";
import easybuylogo from "../assets/logo/logo.png";
import { colors } from "../constants";
import { network } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartApi from "@/services/cartApi";
import { addCartItem } from "@/redux/cartSlice";
import { RootState } from "@/redux/store";
import { ProductResponse } from "@/model/Product";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomIconButton from "@/components/CustomIconButton/CustomIconButton";
import ProductCard from "@/components/ProductCard/ProductCard";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { UserResponse } from "@/model/User";
import Carousel from "react-native-reanimated-carousel";
import { RootStackParamList } from "@/routes/Routers";
import { CompositeScreenProps } from "@react-navigation/native";
import productApi from "@/services/productApi";
import debounce from "lodash.debounce";
import { useDebounce } from "use-debounce";
import { Category, CategoryResponse } from "@/model/Category";
import categoryApi from "@/services/categoryApi";

type TabParamList = {
  home: { user: UserResponse };
  categories: { user: UserResponse; categoryID?: string };
  myorder: { user: UserResponse };
  user: { user: UserResponse };
};

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "home">,
  NativeStackScreenProps<RootStackParamList>
>;

const slides = [
  require("../assets/image/banners/banner.jpg"),
  require("../assets/image/banners/banner1.jpg"),
];

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { user } = route.params;
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [refeshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
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

  const { data: products } = useQuery({
    queryKey: ["products", { limit: 2, offset: 0 }],
    queryFn: () => productApi.getProducts(4, 0),
    refetchOnWindowFocus: false,
  });

  const convertToJSON = (obj: string | any) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch {
      setUserInfo(obj);
    }
  };

  const handleProductPress = (productId: number) => {
    navigation.getParent()?.navigate("productdetail", { productId })
  };

  const handleAddToCart = (productId: number) => {
    if (!authenticated) {
      alert("Please log in to add items to your cart.");
      return;
    }
    addToCart({ productId });
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

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);

  const { data = [], isLoading } = useQuery<ProductResponse[]>({
    queryKey: ["search", debouncedQuery],
    queryFn: () => productApi.searchGames(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  //category
  const { data: category } = useQuery<CategoryResponse[]>({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    refetchOnWindowFocus: false,
  });

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
        <TouchableOpacity>
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
              onChangeText={setQuery}
            />
          </View>

          {data.length > 0 && (
            <FlatList
              style={styles.dropdownList}
              data={data}
              keyExtractor={(item) => item.productId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setQuery(item.productName);
                    // handleProductPress(item); // xử lý chọn item
                  }}
                >
                  <View style={styles.dropdownItemContent}>
                    <Image
                      source={{ uri: item.img }}
                      style={styles.productImage}
                    />
                    <Text style={styles.dropdownItemText}>
                      {item.productName}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cartIconContainer}>
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
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.promotiomSliderContainer}>
            <Carousel
              width={355}
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
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              data={category}
              keyExtractor={(item) => item.cate_ID.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    navigation.getParent()?.navigate("viewcategories", {
                      cate_ID: item.cate_ID,
                      categoryName: item.name,
                    });
                  }}
                >
                  <Image
                    source={{ uri: item.urlImage }}
                    style={styles.categoryImage}
                  />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>New Arrivals</Text>
          </View>
          {(products ?? []).length === 0 ? (
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
                data={(products ?? []).slice(0, 4)}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={({ item }) => (
                  <View
                    key={item.productId}
                    style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                  >
                    <ProductCard
                      name={item.productName}
                      image={item.img}
                      price={item.price}
                      quantity={item.stock}
                      onPress={() => handleProductPress(item.productId)}
                      onPressSecondary={() => handleAddToCart(item.productId)}               />
                  </View>
                )}
              />
              <View style={styles.emptyView}></View>
            </View>
          )}

          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>New Arrivals</Text>
          </View>
          {(products ?? []).length === 0 ? (
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
                data={(products ?? []).slice(0, 4)}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={({ item }) => (
                  <View
                    key={item.productId}
                    style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                  >
                    <ProductCard
                      name={item.productName}
                      image={item.img}
                      price={item.price}
                      quantity={item.stock}
                      onPress={() => handleProductPress(item.productId)}
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
    top: Platform.OS === "android" ? 55 : 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 30,
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
  dropdownItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  productImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
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
    width: "100%",
    marginTop: 30, // đảm bảo dưới phần search
    marginHorizontal: 10,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    // backgroundColor: "black",
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
    paddingVertical: 10,
  },

  flatListContent: {
    paddingHorizontal: 10,
  },

  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    width: 100,
  },

  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "#e0e0e0",
    resizeMode: "cover",
    marginBottom: 5,
  },

  categoryName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
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
    paddingTop: 10,
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
  buttonText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "bold",
  },
});