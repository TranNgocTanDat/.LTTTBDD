import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/auth/Login";
import Tabs from "./tabs/Tabs";
import { UserResponse } from "@/model/User";
import Splash from "@/screens/Splash";
import MyOrderDetailScreen, { Order } from "@/screens/user/MyOrderDetailScreen";

import CartScreen from "@/screens/user/CartScreen";

// import SignupScreen from "../screens/auth/SignupScreen";

import SignupScreen from "../screens/auth/RegisterScreen";
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
import VerifyUserScreen from "../screens/auth/VerifyUserScreen";
import ProductDetailScreen from "@/screens/products/ProductDetail";
import { ProductResponse } from "@/model/Product";
import OAuth2RedirectScreen from "@/screens/auth/OAuth2RedirectScreen";
import DashboardScreen from "../admin/screens/AdminDashboardScreen";
// import Splash from "../screens/auth/Splash";
// import UpdatePasswordScreen from "../screens/profile/UpdatePasswordScreen";
// import MyAccountScreen from "../screens/profile/MyAccountScreen";
// import AddProductScreen from "../screens/admin/AddProductScreen";

// import ViewProductScreen from "../screens/admin/ViewProductScreen";
// import Tabs from "./tabs/Tabs";
// import CartScreen from "../screens/user/CartScreen";
import CheckoutScreen from "../screens/user/CheckoutScreen";
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "@/screens/user/NotificationScreen";
import AdminDashboardScreen from "../admin/screens/AdminDashboardScreen";
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
  verify :{ email: string };
  oauth2redirect: { token: string };
  forgetpassword: undefined;
  updatepassword: undefined;
  myaccount: undefined;
  mywishlist: undefined;
  admindashboard: undefined;
  addproduct: undefined;
  viewproduct: undefined;
  editproduct: undefined;
  tab: UserResponse;
  cart: { user: UserResponse };
  checkout: undefined;
  orderconfirm: undefined;
  productdetail: { product: ProductResponse };
  vieworder: undefined;
  vieworderdetails: undefined;
  myorder: undefined;
  myorderdetail: {
    orderDetail: Order;
    Token?: string;
  };
  viewcategories: undefined;
  addcategories: undefined;
  editcategories: undefined;
  viewusers: undefined;
  categories: undefined;
  notification: undefined;
  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" component={Splash} />

        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="forgetpassword" component={ForgetPasswordScreen} />
          <Stack.Screen name="verify" component={VerifyUserScreen} />
        <Stack.Screen name="oauth2redirect" component={OAuth2RedirectScreen} />
        <Stack.Screen name="admindashboard" component={AdminDashboardScreen}></Stack.Screen>

        {/* <Stack.Screen name="updatepassword" component={UpdatePasswordScreen} /> */}
        {/* <Stack.Screen name="myaccount" component={MyAccountScreen} /> */}
        {/* <Stack.Screen name="mywishlist" component={MyWishlistScreen} /> */}

        {/* <Stack.Screen name="addproduct" component={AddProductScreen} /> */}
        {/* <Stack.Screen name="viewproduct" component={ViewProductScreen} /> */}
        {/* <Stack.Screen name="editproduct" component={EditProductScreen} /> */}
        <Stack.Screen name="tab" component={Tabs} />
         <Stack.Screen name="cart" component={CartScreen} />
         <Stack.Screen name="checkout" component={CheckoutScreen} />
        {/* <Stack.Screen name="orderconfirm" component={OrderConfirmScreen} /> */}
        <Stack.Screen name="productdetail" component={ProductDetailScreen} />
        {/* <Stack.Screen name="vieworder" component={ViewOrdersScreen} /> */}
        {/* <Stack.Screen name="vieworderdetails" component={ViewOrderDetailScreen} /> */}
        {/* <Stack.Screen name="myorder" component={MyOrderScreen} /> */}
        <Stack.Screen name="myorderdetail" component={MyOrderDetailScreen} />
        {/* <Stack.Screen name="viewcategories" component={ViewCategoryScreen} /> */}
        {/* <Stack.Screen name="addcategories" component={AddCategoryScreen} /> */}
        {/* <Stack.Screen name="editcategories" component={EditCategoryScreen} /> */}
        {/* <Stack.Screen name="viewusers" component={ViewUsersScreen} /> */}
         <Stack.Screen name="notification" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
