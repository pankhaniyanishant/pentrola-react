import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';




export interface WishlistItem {
    id: number | string;
    title: string;
    price: string | number;
    image: string;
    category?: string;
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

    // Load wishlist from API or local storage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            api.get(`/wishlist/${user.uid}`)
                .then(({ data }) => {
                    if (data && data.items) setWishlistItems(data.items);
                })
                .catch(err => console.error('Error loading wishlist', err));
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
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            api.post(`/wishlist/${user.uid}`, { items: wishlistItems })
                .catch(err => console.error('Error saving wishlist', err));
        }
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
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
