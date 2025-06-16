import React from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "@/model/Product";
import productApi from "@/services/productApi";
import ProductCard from "@/components/ProductCard/ProductCard";
import categoryApi from "@/services/categoryApi";
import { RootStackParamList } from "@/routes/Routers";
import { CategoryResponse } from "@/model/Category";
import { COLORS, SPACING } from "@/theme/theme";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
type CategoryProductsRouteProp = RouteProp<
  RootStackParamList,
  "viewcategories"
>;

const CategoryProductsScreen = () => {
  const { cate_ID, categoryName } =
    useRoute<CategoryProductsRouteProp>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: products, isLoading } = useQuery({
    queryKey: ["category-products", cate_ID],
    queryFn: () => categoryApi.getCategoryById(cate_ID),
  });
  const tabBarHeight = 60;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={COLORS.primaryWhiteHex}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>{categoryName}</Text>
        {/*<Text style={styles.screenNameParagraph}>*/}
        {/*    Browse and add to cart*/}
        {/*</Text>*/}
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primaryWhiteHex}
          style={{ marginTop: 50 }}
        />
      ) : (
       
          <FlatList
            data={products?.productList}
            numColumns={2}
            columnWrapperStyle={styles.row}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={({ item }) => (
              <ProductCard
               product={item}
                onPress={() => navigation.navigate("productdetail", { productId: item.productId })}
                onPressSecondary={() => {}}
              />
            )}
          />
      )}
    </View>
  );
};

export default CategoryProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    // padding: SPACING.space_15,
    paddingBottom: 0,
  },
  TopBarContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 50,
  },
  screenNameContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primaryWhiteHex,
    textAlign: "center",
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.primaryGreyHex,
  },

  row: {
    
    justifyContent: "space-around",
    marginBottom: SPACING.space_20,
  },
});
