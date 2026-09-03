import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Load saved cart from localStorage
const savedCart = localStorage.getItem('cmm_cart');
const preloadedState = {
  cart: savedCart ? JSON.parse(savedCart) : { items: [] }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

// Save to localStorage every time the cart changes
store.subscribe(() => {
  localStorage.setItem('cmm_cart', JSON.stringify(store.getState().cart));
});