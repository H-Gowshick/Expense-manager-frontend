import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Button from '../components/Button';
import { requestNotificationPermissions, scheduleDailySummary } from '../services/notificationService';

const NotificationPermissionsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const requestPermissions = async () => {
        setLoading(true);
        try {
            const result = await requestNotificationPermissions();

            if (result.status === 'granted') {
                // Schedule daily summary
                await scheduleDailySummary();

                Alert.alert(
                    'Success',
                    'Notifications enabled! You will receive budget alerts and daily summaries.',
                    [
                        {
                            text: 'Continue',
                            onPress: () => navigation.replace('Permissions')
                        }
                    ]
                );
            } else if (result.status === 'denied') {
                Alert.alert(
                    'Permission Required',
                    'You can enable notifications later in app settings.',
                    [
                        { text: 'Continue', onPress: () => navigation.replace('Permissions') }
                    ]
                );
            } else {
                Alert.alert('Error', 'Could not request notification permissions');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const skipForNow = () => {
        navigation.replace('Permissions');
    };

    return (
        <View style={globalStyles.container}>
            <View style={styles.inner}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🔔</Text>
                </View>

                <Text style={globalStyles.title}>Stay Updated</Text>

                <Text style={styles.description}>
                    Get instant alerts when you're close to or exceed your budget limits.
                    We'll also send you daily spending summaries.
                </Text>

                <View style={styles.permissionCard}>
                    <Text style={styles.permissionTitle}>You'll receive:</Text>
                    <Text style={styles.permissionItem}>✓ Budget exceed alerts</Text>
                    <Text style={styles.permissionItem}>✓ Daily spending summary at 9 PM</Text>
                    <Text style={styles.permissionItem}>✓ Category-wise budget warnings</Text>
                    <Text style={styles.permissionItem}>✓ EMI and payment reminders</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.accent} />
                ) : (
                    <Button
                        title="Enable Notifications"
                        onPress={requestPermissions}
                        variant="accent"
                    />
                )}

                <TouchableOpacity
                    onPress={skipForNow}
                    style={styles.skipButton}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    You can enable notifications later from settings
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.highlight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 30,
    },
    icon: {
        fontSize: 50,
    },
    description: {
        fontSize: 16,
        color: colors.secondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    permissionCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: colors.highlight + '30',
    },
    permissionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 12,
    },
    permissionItem: {
        fontSize: 15,
        color: colors.secondary,
        marginBottom: 8,
    },
    skipButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    skipText: {
        color: colors.gray,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    note: {
        marginTop: 30,
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
    },
});

export default NotificationPermissionsScreen;