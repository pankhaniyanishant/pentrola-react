import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';




export interface WishlistItem {
    id: number | string;
    title: string;
    price: string | number;
    image: string;
    category?: string;
    stock?: number;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: number | string) => void;
    isInWishlist: (id: number | string) => boolean;
    toggleWishlist: (item: WishlistItem) => void;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const { isLoggedIn } = useAuth();

// Load wishlist from API or local storage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            console.log('Loading wishlist for user:', user.uid);
            api.get(`/wishlist/${user.uid}`)
                .then(({ data }) => {
                    console.log('Wishlist loaded from API:', data);
                    if (data && data.items && Array.isArray(data.items)) {
                        setWishlistItems(data.items);
                    }
                })
                .catch(err => {
                    console.error('Error loading wishlist from API:', err);
                    const storedWishlist = localStorage.getItem('wishlistItems');
                    if (storedWishlist) {
                        try {
                            setWishlistItems(JSON.parse(storedWishlist));
                        } catch {
                            setWishlistItems([]);
                        }
                    }
                });
        } else {
            const storedWishlist = localStorage.getItem('wishlistItems');
            if (storedWishlist) {
                try {
                    setWishlistItems(JSON.parse(storedWishlist));
                } catch {
                    setWishlistItems([]);
                }
            }
        }
    }, []);

// Persist wishlist to API and local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        console.log('useEffect triggered, wishlistItems:', wishlistItems);
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (wishlistItems.length > 0) {
                console.log('Saving NON-EMPTY wishlist for user:', user.uid, 'items:', wishlistItems);
            }
            api.post(`/wishlist/${user.uid}`, { items: wishlistItems })
                .then(({ data }) => {
                    console.log('Wishlist saved to API:', data);
                })
                .catch(err => console.error('Error saving wishlist to API:', err));
        }
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        if (!isLoggedIn) {
            alert('Please sign in to add items to wishlist');
            return;
        }
        setWishlistItems(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: number | string) => {
        setWishlistItems(prev => prev.filter(i => i.id !== id));
    };

    const isInWishlist = (id: number | string) => wishlistItems.some(i => i.id === id);

    const toggleWishlist = (item: WishlistItem) => {
        if (!isLoggedIn) {
            alert('Please sign in to add items to wishlist');
            return;
        }
        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
        } else {
            addToWishlist(item);
        }
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            wishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
