import { create } from "zustand";
import { produce } from "immer";
import type { ImageSourcePropType } from "react-native";

// ====== Cart Types ======
type Price = {
    size: string;
    price: string;
    quantity: number;
};

export type CartItem = {
    id: string;
    name: string;
    prices: Price[];
    image: ImageSourcePropType;
    special_ingredient: string;
    roasted: string;
    type: string;
    index: number;
    ItemPrice?: string;
};

// ====== Notification Types ======
export type NotificationItem = {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
};


export interface CartStore {
    CartList: CartItem[];
    CartPrice: string;

    NotificationList: NotificationItem[];

    addToCart: (cartItem: CartItem) => void;
    incrementCartItemQuantity: (id: string, size: string) => void;
    decrementCartItemQuantity: (id: string, size: string) => void;
    removeFromCart: (id: string, size: string) => void;
    calculateCartPrice: () => void;
    clearCart: () => void;

    addNotification: (notification: NotificationItem) => void;
    markNotificationAsRead: (id: string) => void;
    clearAllNotifications: () => void;
}

export const useStore = create<CartStore>()((set) => ({
    CartList: [],
    CartPrice: "0",
    NotificationList: [],

    calculateCartPrice: () =>
        set(
            produce((state: CartStore) => {
                let total = 0;
                for (const cartItem of state.CartList) {
                    for (const price of cartItem.prices) {
                        total += parseFloat(price.price) * price.quantity;
                    }
                }
                state.CartPrice = total.toLocaleString("vi-VN");
            })
        ),

    addToCart: (cartItem: CartItem) =>
        set(
            produce((state: CartStore) => {
                let found = false;
                for (let i = 0; i < state.CartList.length; i++) {
                    if (state.CartList[i].id === cartItem.id) {
                        found = true;
                        let sizeMatched = false;
                        for (let j = 0; j < state.CartList[i].prices.length; j++) {
                            if (state.CartList[i].prices[j].size === cartItem.prices[0].size) {
                                sizeMatched = true;
                                state.CartList[i].prices[j].quantity++;
                                break;
                            }
                        }
                        if (!sizeMatched) {
                            state.CartList[i].prices.push(cartItem.prices[0]);
                        }
                        state.CartList[i].prices.sort((a, b) => (a.size > b.size ? -1 : 1));
                        break;
                    }
                }
                if (!found) {
                    state.CartList.push(cartItem);
                }
            })
        ),

    incrementCartItemQuantity: (id: string, size: string) =>
        set(
            produce((state: CartStore) => {
                for (let cartItem of state.CartList) {
                    if (cartItem.id === id) {
                        for (let price of cartItem.prices) {
                            if (price.size === size) {
                                price.quantity++;
                                return;
                            }
                        }
                    }
                }
            })
        ),

    decrementCartItemQuantity: (id: string, size: string) =>
        set(
            produce((state: CartStore) => {
                for (let i = 0; i < state.CartList.length; i++) {
                    if (state.CartList[i].id === id) {
                        for (let j = 0; j < state.CartList[i].prices.length; j++) {
                            if (state.CartList[i].prices[j].size === size) {
                                state.CartList[i].prices[j].quantity--;
                                if (state.CartList[i].prices[j].quantity === 0) {
                                    state.CartList[i].prices.splice(j, 1);
                                }
                                break;
                            }
                        }
                        if (state.CartList[i].prices.length === 0) {
                            state.CartList.splice(i, 1);
                        }
                        break;
                    }
                }
            })
        ),

    removeFromCart: (id: string, size: string) =>
        set(
            produce((state: CartStore) => {
                for (let i = 0; i < state.CartList.length; i++) {
                    if (state.CartList[i].id === id) {
                        const newPrices = state.CartList[i].prices.filter(
                            (price) => price.size !== size
                        );
                        if (newPrices.length === 0) {
                            state.CartList.splice(i, 1);
                        } else {
                            state.CartList[i].prices = newPrices;
                        }
                        break;
                    }
                }
            })
        ),

    clearCart: () =>
        set(
            produce((state: CartStore) => {
                state.CartList = [];
                state.CartPrice = "0";
            })
        ),

    // ====== Notification Functions ======
    addNotification: (notification) =>
        set((state) => ({
            NotificationList: [...state.NotificationList, notification],
        })),

    clearAllNotifications: () => set({ NotificationList: [] }),

    markNotificationAsRead: (id: string) =>
        set((state) => ({
            NotificationList: state.NotificationList.map((item) =>
                item.id === id ? { ...item, read: true } : item
            ),
        })),


}));
