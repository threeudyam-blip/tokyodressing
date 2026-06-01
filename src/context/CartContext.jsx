import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(
        i => i.id === action.item.id && i.size === action.item.size && i.color === action.item.color
      );
      if (existing) {
        return state.map(i =>
          i.id === action.item.id && i.size === action.item.size && i.color === action.item.color
            ? { ...i, qty: i.qty + (action.item.qty || 1) }
            : i
        );
      }
      return [...state, { ...action.item, qty: action.item.qty || 1 }];
    }
    case 'REMOVE':
      return state.filter(i => !(i.id === action.id && i.size === action.size && i.color === action.color));
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id && i.size === action.size && i.color === action.color
          ? { ...i, qty: Math.max(1, action.qty) }
          : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart   = (item) => dispatch({ type: 'ADD',        item });
  const removeItem  = (id, size, color) => dispatch({ type: 'REMOVE',     id, size, color });
  const updateQty   = (id, size, color, qty) => dispatch({ type: 'UPDATE_QTY', id, size, color, qty });
  const clearCart   = () => dispatch({ type: 'CLEAR' });

  const totalItems  = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const originalTotal = cart.reduce((s, i) => s + (i.originalPrice || i.price) * i.qty, 0);
  const savings     = originalTotal - subtotal;
  const shipping    = subtotal >= 999 ? 0 : 99;
  const total       = subtotal + shipping;

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeItem, updateQty, clearCart,
      totalItems, subtotal, savings, shipping, total, originalTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
