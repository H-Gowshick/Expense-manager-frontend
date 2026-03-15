import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
    try {
        if (!Device.isDevice) {
            return { status: 'unavailable', message: 'Must use physical device for notifications' };
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return { status: 'denied', message: 'Failed to get push token for notifications!' };
        }

        // Get Expo push token
        const token = await Notifications.getExpoPushTokenAsync({
            projectId: '1a52ea20-1075-4aef-8110-f7687be2ae63', // Your EAS project ID
        });

        // Store token
        await AsyncStorage.setItem('expoPushToken', token.data);

        // Android specific channel setup
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('budget-alerts', {
                name: 'Budget Alerts',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#C3110C',
                sound: 'default',
                enableVibrate: true,
            });

            await Notifications.setNotificationChannelAsync('daily-summary', {
                name: 'Daily Summary',
                importance: Notifications.AndroidImportance.DEFAULT,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#E6501B',
                sound: 'default',
                enableVibrate: true,
            });
        }

        return { status: 'granted', token: token.data };
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return { status: 'error', error: error.message };
    }
};

// Schedule a notification
export const scheduleNotification = async (title, body, trigger = null) => {
    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: { type: 'budget-alert' },
            },
            trigger,
        });
        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
    }
};

// Send immediate notification
export const sendImmediateNotification = async (title, body) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null, // Send immediately
        });
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

// Check budget and send alerts
export const checkBudgetAndAlert = async (category, spent, monthly, daily, dailySpent) => {
    const notifications = [];

    // Check monthly budget
    if (spent > monthly) {
        notifications.push({
            title: '🚨 Budget Exceeded!',
            body: `You've exceeded your monthly ${category} budget of ₹${monthly}`,
        });
    } else if (spent >= monthly * 0.9) {
        notifications.push({
            title: '⚠️ Budget Warning',
            body: `You've used ${Math.round((spent / monthly) * 100)}% of your monthly ${category} budget`,
        });
    }

    // Check daily budget
    if (dailySpent > daily) {
        notifications.push({
            title: '🚨 Daily Limit Exceeded!',
            body: `You've exceeded your daily ${category} limit of ₹${daily}`,
        });
    } else if (dailySpent >= daily * 0.8) {
        notifications.push({
            title: '⚠️ Daily Limit Warning',
            body: `You've used ${Math.round((dailySpent / daily) * 100)}% of your daily ${category} limit`,
        });
    }

    // Send all notifications
    for (const notification of notifications) {
        await sendImmediateNotification(notification.title, notification.body);
    }

    return notifications;
};

// Schedule daily summary at 9 PM
export const scheduleDailySummary = async () => {
    const trigger = {
        hour: 21,
        minute: 0,
        repeats: true,
    };

    await scheduleNotification(
        '📊 Daily Expense Summary',
        'Check your spending for today and budget status',
        trigger
    );
};