import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';




export interface CartItem {
    id: number | string;
    title: string;
    price: number;
    originalPrice?: string;
    image: string;
    quantity: number;
    category?: string;
    stock?: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number | string) => void;
    updateQuantity: (id: number | string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { isLoggedIn } = useAuth();

    // Load cart from API or local storage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            api.get(`/cart/${user.uid}`)
                .then(({ data }) => {
                    if (data && data.items) setCartItems(data.items);
                })
                .catch(err => console.error('Error loading cart', err));
        } else {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                try {
                    setCartItems(JSON.parse(storedCart));
                } catch {
                    setCartItems([]);
                }
            }
        }
    }, []);

// Persist cart to API and local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        const userStr = localStorage.getItem('user');
        if (userStr && cartItems.length > 0) {
            try {
                const user = JSON.parse(userStr);
                const sanitizedItems = cartItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: Number(item.price) || 0,
                    image: item.image || '',
                    quantity: Number(item.quantity) || 1,
                    category: item.category || '',
                    stock: Number(item.stock) || 0
                }));
                api.post(`/cart/${user.uid}`, { items: sanitizedItems })
                    .catch(err => console.error('Error saving cart', err));
            } catch (e) {
                console.error('Error parsing user', e);
            }
        }
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        if (!isLoggedIn) {
            alert('Please sign in to add items to cart');
            return;
        }
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                if (item.stock !== undefined && existingItem.quantity >= item.stock) {
                    alert(`Only ${item.stock} items available in stock.`);
                    return prevItems;
                }
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number | string) => {
        setCartItems(prevItems => prevItems.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number | string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(i => {
                if (i.id === id) {
                    if (i.stock !== undefined && quantity > i.stock) {
                        alert(`Only ${i.stock} items available in stock.`);
                        return i;
                    }
                    return { ...i, quantity };
                }
                return i;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
