import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Price = {
    size: string;
    price: string;
    quantity: number;
};

type CartItem = {
    id: string;
    name: string;
    prices: Price[];
    imagelink_square: string;
    special_ingredient: string;
    roasted: string;
    type: string;
    index: number;
    ItemPrice?: string;
};

interface CartStore {
    CartList: CartItem[];
    CartPrice: string;
    addToCart: (cartItem: CartItem) => void;
    incrementCartItemQuantity: (id: string, size: string) => void;
    decrementCartItemQuantity: (id: string, size: string) => void;
    calculateCartPrice: () => void;
     removeFromCart: (id: string, size: string) => void;
    addToOrderHistoryListFromCart: () => void;
    OrderHistoryList: {
        OrderDate: string;
        CartList: CartItem[];
        CartListPrice: string;
    }[];
}

export const useStore = create<CartStore>()(
    persist(
        (set, get) => ({
            CartList: [],
            CartPrice: '0',
            OrderHistoryList: [],

            addToCart: (cartItem) =>
                set(
                    produce((state: CartStore) => {
                        let found = false;
                        for (let i = 0; i < state.CartList.length; i++) {
                            if (state.CartList[i].id === cartItem.id) {
                                found = true;
                                let sizeMatched = false;
                                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                                    if (
                                        state.CartList[i].prices[j].size === cartItem.prices[0].size
                                    ) {
                                        sizeMatched = true;
                                        state.CartList[i].prices[j].quantity++;
                                        break;
                                    }
                                }
                                if (!sizeMatched) {
                                    state.CartList[i].prices.push(cartItem.prices[0]);
                                }
                                state.CartList[i].prices.sort((a, b) =>
                                    a.size > b.size ? -1 : 1,
                                );
                                break;
                            }
                        }
                        if (!found) {
                            state.CartList.push(cartItem);
                        }
                    }),
                ),

            incrementCartItemQuantity: (id, size) =>
                set(
                    produce((state: CartStore) => {
                        for (const item of state.CartList) {
                            if (item.id === id) {
                                for (const price of item.prices) {
                                    if (price.size === size) {
                                        price.quantity++;
                                        break;
                                    }
                                }
                            }
                        }
                    }),
                ),

            decrementCartItemQuantity: (id, size) =>
                set(
                    produce((state: CartStore) => {
                        for (let i = 0; i < state.CartList.length; i++) {
                            if (state.CartList[i].id === id) {
                                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                                    if (state.CartList[i].prices[j].size === size) {
                                        if (state.CartList[i].prices.length > 1) {
                                            if (state.CartList[i].prices[j].quantity > 1) {
                                                state.CartList[i].prices[j].quantity--;
                                            } else {
                                                state.CartList[i].prices.splice(j, 1);
                                            }
                                        } else {
                                            if (state.CartList[i].prices[j].quantity > 1) {
                                                state.CartList[i].prices[j].quantity--;
                                            } else {
                                                state.CartList.splice(i, 1);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }),
                ),

            calculateCartPrice: () =>
                set(
                    produce((state: CartStore) => {
                        let total = 0;
                        for (const item of state.CartList) {
                            let itemTotal = 0;
                            for (const price of item.prices) {
                                itemTotal += parseFloat(price.price) * price.quantity;
                            }
                            item.ItemPrice = itemTotal.toFixed(2);
                            total += itemTotal;
                        }
                        state.CartPrice = total.toFixed(2);
                    }),
                ),

            removeFromCart: (id, size) =>
                set(
                    produce((state: CartStore) => {
                        for (let i = 0; i < state.CartList.length; i++) {
                            if (state.CartList[i].id === id) {
                                const prices = state.CartList[i].prices;
                                if (prices.length === 1) {
                                    // Nếu chỉ còn 1 size, xóa luôn item
                                    state.CartList.splice(i, 1);
                                } else {
                                    // Nếu còn nhiều size, chỉ xóa size đó
                                    state.CartList[i].prices = prices.filter(
                                        (price) => price.size !== size
                                    );
                                }
                                break;
                            }
                        }
                    })
                ),


            addToOrderHistoryListFromCart: () =>
                set(
                    produce((state: CartStore) => {
                        const total = state.CartList.reduce(
                            (sum, item) => sum + parseFloat(item.ItemPrice || '0'),
                            0,
                        );
                        const order = {
                            OrderDate:
                                new Date().toDateString() + ' ' + new Date().toLocaleTimeString(),
                            CartList: state.CartList,
                            CartListPrice: total.toFixed(2),
                        };
                        state.OrderHistoryList.unshift(order);
                        state.CartList = [];
                    }),
                ),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
