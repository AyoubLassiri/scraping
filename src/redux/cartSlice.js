import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      // Create a unique index check based on product ID and selected size
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: 1,
          // Ensure promo fields are properly tracked in the cart item
          promoType: action.payload.promoType || 'none',
          promoValue: action.payload.promoValue || 0
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (item) item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;