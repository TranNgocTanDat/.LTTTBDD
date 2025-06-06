import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/auth/Login";

// import SignupScreen from "../screens/auth/SignupScreen";
// import Splash from "../screens/auth/Splash";
// import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
// import UpdatePasswordScreen from "../screens/profile/UpdatePasswordScreen";
// import MyAccountScreen from "../screens/profile/MyAccountScreen";
// import AddProductScreen from "../screens/admin/AddProductScreen";
// import DashboardScreen from "../screens/admin/DashboardScreen";
// import ViewProductScreen from "../screens/admin/ViewProductScreen";
// import Tabs from "./tabs/Tabs";
// import CartScreen from "../screens/user/CartScreen";
// import CheckoutScreen from "../screens/user/CheckoutScreen";
// import OrderConfirmScreen from "../screens/user/OrderConfirmScreen";
// import ProductDetailScreen from "../screens/user/ProductDetailScreen";
// import EditProductScreen from "../screens/admin/EditProductScreen";
// import ViewOrdersScreen from "../screens/admin/ViewOrdersScreen";
// import ViewOrderDetailScreen from "../screens/admin/ViewOrderDetailScreen";
// import MyOrderScreen from "../screens/user/MyOrderScreen";
// import MyOrderDetailScreen from "../screens/user/MyOrderDetailScreen";
// import ViewCategoryScreen from "../screens/admin/ViewCategoryScreen";
// import AddCategoryScreen from "../screens/admin/AddCategoryScreen";
// import ViewUsersScreen from "../screens/admin/ViewUsersScreen";
// import CategoriesScreen from "../screens/user/CategoriesScreen";
// import EditCategoryScreen from "../screens/admin/EditCategoryScreen";
// import MyWishlistScreen from "../screens/profile/MyWishlistScreen";

export type RootStackParamList = {
  splash: undefined;
  login: undefined;
  signup: undefined;
  forgetpassword: undefined;
  updatepassword: undefined;
  myaccount: undefined;
  mywishlist: undefined;
  dashboard: undefined;
  addproduct: undefined;
  viewproduct: undefined;
  editproduct: undefined;
  tab: undefined;
  cart: undefined;
  checkout: undefined;
  orderconfirm: undefined;
  productdetail: undefined;
  vieworder: undefined;
  vieworderdetails: undefined;
  myorder: undefined;
  myorderdetail: undefined;
  viewcategories: undefined;
  addcategories: undefined;
  editcategories: undefined;
  viewusers: undefined;
  categories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="splash" component={Splash} /> */}
        <Stack.Screen name="login" component={LoginScreen} />
        {/* <Stack.Screen name="signup" component={SignupScreen} /> */}
        {/* <Stack.Screen name="forgetpassword" component={ForgetPasswordScreen} /> */}
        {/* <Stack.Screen name="updatepassword" component={UpdatePasswordScreen} /> */}
        {/* <Stack.Screen name="myaccount" component={MyAccountScreen} /> */}
        {/* <Stack.Screen name="mywishlist" component={MyWishlistScreen} /> */}
        {/* <Stack.Screen name="dashboard" component={DashboardScreen} /> */}
        {/* <Stack.Screen name="addproduct" component={AddProductScreen} /> */}
        {/* <Stack.Screen name="viewproduct" component={ViewProductScreen} /> */}
        {/* <Stack.Screen name="editproduct" component={EditProductScreen} /> */}
        {/* <Stack.Screen name="tab" component={Tabs} /> */}
        {/* <Stack.Screen name="cart" component={CartScreen} /> */}
        {/* <Stack.Screen name="checkout" component={CheckoutScreen} /> */}
        {/* <Stack.Screen name="orderconfirm" component={OrderConfirmScreen} /> */}
        {/* <Stack.Screen name="productdetail" component={ProductDetailScreen} /> */}
        {/* <Stack.Screen name="vieworder" component={ViewOrdersScreen} /> */}
        {/* <Stack.Screen name="vieworderdetails" component={ViewOrderDetailScreen} /> */}
        {/* <Stack.Screen name="myorder" component={MyOrderScreen} /> */}
        {/* <Stack.Screen name="myorderdetail" component={MyOrderDetailScreen} /> */}
        {/* <Stack.Screen name="viewcategories" component={ViewCategoryScreen} /> */}
        {/* <Stack.Screen name="addcategories" component={AddCategoryScreen} /> */}
        {/* <Stack.Screen name="editcategories" component={EditCategoryScreen} /> */}
        {/* <Stack.Screen name="viewusers" component={ViewUsersScreen} /> */}
        {/* <Stack.Screen name="categories" component={CategoriesScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
