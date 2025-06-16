import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';

const CheckoutSuccessScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <CheckoutSuccess
      title="🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng."
      onPress={() => navigation.navigate('tab')} // hoặc trang bạn muốn quay lại
    />
  );
};

export default CheckoutSuccessScreen;
