import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://expense-manager-app-ex32.onrender.com/api';

// Store tokens
export const storeTokens = async (accessToken, refreshToken) => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
        console.error('Error storing tokens:', error);
    }
};

// Get access token
export const getAccessToken = async () => {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Get refresh token
export const getRefreshToken = async () => {
    try {
        return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

// Clear tokens (logout)
export const clearTokens = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
};

// Signup API
export const signup = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Login API
export const login = async (emailOrPhno) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailOrPhno }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store tokens
        if (data.accessToken && data.refreshToken) {
            await storeTokens(data.accessToken, data.refreshToken);
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    const token = await getAccessToken();
    return !!token;
};