import * as SMS from 'expo-sms';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { scheduleNotification } from './notificationService';

// Categories and their keywords for classification
const CATEGORIES = {
    FOOD: {
        keywords: ['restaurant', 'zomato', 'swiggy', 'food', 'cafe', 'pizza', 'burger', 'dining', 'eatery', 'hotel', 'lunch', 'dinner'],
        icon: '🍔',
        color: '#E6501B'
    },
    TRANSPORT: {
        keywords: ['uber', 'ola', 'rapido', 'taxi', 'metro', 'bus', 'train', 'fuel', 'petrol', 'diesel', 'parking', 'toll'],
        icon: '🚗',
        color: '#C3110C'
    },
    SHOPPING: {
        keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'store', 'mall', 'clothing', 'electronics', 'purchase'],
        icon: '🛍️',
        color: '#740A03'
    },
    ENTERTAINMENT: {
        keywords: ['netflix', 'amazon prime', 'hotstar', 'sony liv', 'zee5', 'movie', 'cinema', 'theatre', 'spotify', 'game'],
        icon: '🎮',
        color: '#280905'
    },
    BILLS: {
        keywords: ['bill', 'electricity', 'water', 'gas', 'broadband', 'wifi', 'mobile', 'recharge', 'internet', 'rent', 'maintenance', 'emi', 'loan'],
        icon: '📱',
        color: '#E6501B'
    },
    HEALTH: {
        keywords: ['hospital', 'clinic', 'doctor', 'medicine', 'pharmacy', 'medical', 'health', 'fitness', 'gym', 'diagnostic'],
        icon: '🏥',
        color: '#10B981'
    },
    GROCERY: {
        keywords: ['grocery', 'supermarket', 'bigbasket', 'grofers', 'blinkit', 'zepto', 'dairy', 'vegetables', 'fruits'],
        icon: '🛒',
        color: '#F59E0B'
    },
    OTHER: {
        keywords: [],
        icon: '📦',
        color: '#9CA3AF'
    }
};

// Bank transaction patterns
const BANK_PATTERNS = [
    // UPI patterns
    { regex: /(?:Rs|INR|₹)\s*([0-9,]+)\s*(?:debited|paid|spent|transferred)/i, type: 'expense' },
    { regex: /(?:Rs|INR|₹)\s*([0-9,]+)\s*(?:credited|received|added)/i, type: 'income' },
    { regex: /(?:debited|paid|spent|transferred)\s+(?:by|of|with)\s+(?:Rs|INR|₹)\s*([0-9,]+)/i, type: 'expense' },
    { regex: /(?:credited|received|added)\s+(?:with|of)\s+(?:Rs|INR|₹)\s*([0-9,]+)/i, type: 'income' },

    // Card patterns
    { regex: /(?:purchase|transaction|payment|txn)\s+(?:at|of|for)\s+(?:Rs|INR|₹)\s*([0-9,]+)/i, type: 'expense' },
    { regex: /(?:card|acct|xac)\s+([A-Z]+)\s+(?:used|debited)\s+(?:for|with)\s+(?:Rs|INR|₹)\s*([0-9,]+)/i, type: 'expense' },

    // ATM patterns
    { regex: /(?:ATM|withdrawal)\s+(?:of|for)\s+(?:Rs|INR|₹)\s*([0-9,]+)/i, type: 'expense' },
];

// Request SMS permission
export const requestSMSPermission = async () => {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: 'SMS Permission',
                    message: 'Expense Tracker needs access to your SMS to automatically track your expenses from transaction messages.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

// Parse amount from string
const parseAmount = (amountStr) => {
    try {
        // Remove commas and convert to number
        const cleanStr = amountStr.replace(/,/g, '').trim();
        const amount = parseFloat(cleanStr);
        return isNaN(amount) ? 0 : amount;
    } catch (error) {
        return 0;
    }
};

// Extract transaction details from SMS
export const extractTransactionFromSMS = (smsBody) => {
    try {
        let amount = 0;
        let type = 'unknown';
        let description = '';

        // Try each pattern
        for (const pattern of BANK_PATTERNS) {
            const match = smsBody.match(pattern.regex);
            if (match) {
                type = pattern.type;
                // Find the amount in the match groups
                for (let i = 1; i < match.length; i++) {
                    const parsed = parseAmount(match[i]);
                    if (parsed > 0) {
                        amount = parsed;
                        break;
                    }
                }
                if (amount > 0) break;
            }
        }

        // Extract merchant/description
        const merchantMatch = smsBody.match(/(?:at|to|for|via)\s+([A-Za-z\s]+?)(?:\s+(?:on|at|ref|₹|Rs|INR)|$)/i);
        if (merchantMatch) {
            description = merchantMatch[1].trim();
        }

        // If no description found, use first 50 chars
        if (!description) {
            description = smsBody.substring(0, 50).trim();
        }

        return { amount, type, description };
    } catch (error) {
        console.error('Error extracting transaction:', error);
        return { amount: 0, type: 'unknown', description: '' };
    }
};

// Categorize transaction based on description
export const categorizeTransaction = (description) => {
    const lowerDesc = description.toLowerCase();

    for (const [category, data] of Object.entries(CATEGORIES)) {
        if (data.keywords.some(keyword => lowerDesc.includes(keyword))) {
            return { category, icon: data.icon, color: data.color };
        }
    }

    return { category: 'OTHER', icon: '📦', color: '#9CA3AF' };
};

// Read SMS messages (Android only)
export const readSMSMessages = async () => {
    try {
        if (Platform.OS !== 'android') {
            console.log('SMS reading only available on Android');
            return [];
        }

        const hasPermission = await requestSMSPermission();
        if (!hasPermission) {
            return [];
        }

        // For development build, we need to use native module
        // This is a simplified version - in production, you'd use a native module
        // or the Expo SMS API for sending only

        // Since we're in development, return mock data
        return getMockSMSData();
    } catch (error) {
        console.error('Error reading SMS:', error);
        return [];
    }
};

// Mock SMS data for development
const getMockSMSData = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return [
        {
            id: '1',
            body: 'Rs 450.00 debited from your account at ZOMATO on 04 Mar 2026',
            date: today.toISOString(),
            type: 'expense',
            amount: 450,
            description: 'ZOMATO',
            category: 'FOOD',
            icon: '🍔',
            color: '#E6501B'
        },
        {
            id: '2',
            body: 'INR 8500.00 credited to your account - Salary for March 2026',
            date: yesterday.toISOString(),
            type: 'income',
            amount: 8500,
            description: 'Salary',
            category: 'INCOME',
            icon: '💰',
            color: '#10B981'
        },
        {
            id: '3',
            body: 'Your card was used for INR 250.00 at UBER INDIA',
            date: yesterday.toISOString(),
            type: 'expense',
            amount: 250,
            description: 'UBER',
            category: 'TRANSPORT',
            icon: '🚗',
            color: '#C3110C'
        },
        {
            id: '4',
            body: 'Payment of Rs 1200.00 made to AMAZON PAY',
            date: new Date(today.setDate(today.getDate() - 2)).toISOString(),
            type: 'expense',
            amount: 1200,
            description: 'AMAZON',
            category: 'SHOPPING',
            icon: '🛍️',
            color: '#740A03'
        },
        {
            id: '5',
            body: 'EMI payment of Rs 4500.00 for BIKE LOAN successful',
            date: new Date(today.setDate(today.getDate() - 5)).toISOString(),
            type: 'expense',
            amount: 4500,
            description: 'BIKE LOAN EMI',
            category: 'BILLS',
            icon: '📱',
            color: '#E6501B'
        }
    ];
};

// Process SMS and update transactions
export const processSMSAndUpdateTransactions = async (currentTransactions) => {
    const smsMessages = await readSMSMessages();
    const newTransactions = [];

    for (const sms of smsMessages) {
        // Check if transaction already exists
        const exists = currentTransactions.some(t =>
            t.amount === sms.amount &&
            Math.abs(new Date(t.date) - new Date(sms.date)) < 60000 // Within 1 minute
        );

        if (!exists && sms.amount > 0) {
            const { category, icon, color } = categorizeTransaction(sms.description);

            newTransactions.push({
                id: sms.id || Date.now().toString() + Math.random(),
                amount: sms.amount,
                type: sms.type,
                description: sms.description,
                category,
                icon,
                color,
                date: sms.date,
                smsBody: sms.body,
            });

            // Send notification for new transaction
            if (sms.type === 'expense') {
                await scheduleNotification(
                    '💰 New Expense Detected',
                    `${category}: ₹${sms.amount} at ${sms.description}`
                );
            }
        }
    }

    return [...newTransactions, ...currentTransactions];
};