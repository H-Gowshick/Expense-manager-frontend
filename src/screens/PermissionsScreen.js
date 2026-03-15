import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    Alert,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Button from '../components/Button';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';

const PermissionsScreen = ({ navigation }) => {
    const [permissionGranted, setPermissionGranted] = useState(false);

    const requestSMSPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                // Check if permission is already granted
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_SMS
                );

                if (granted) {
                    setPermissionGranted(true);
                    navigation.replace('DateRange');
                    return;
                }

                // Request permission
                const status = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    {
                        title: 'SMS Permission',
                        message: 'Expense Tracker needs access to your SMS to automatically track your expenses from transaction messages.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (status === PermissionsAndroid.RESULTS.GRANTED) {
                    setPermissionGranted(true);
                    Alert.alert(
                        'Success',
                        'SMS permission granted! You can now automatically track expenses.',
                        [{ text: 'Continue', onPress: () => navigation.replace('DateRange') }]
                    );
                } else if (status === PermissionsAndroid.RESULTS.DENIED) {
                    Alert.alert(
                        'Permission Denied',
                        'You can still use the app by manually adding expenses.',
                        [{ text: 'Continue', onPress: () => navigation.replace('DateRange') }]
                    );
                } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        'Permission Required',
                        'Please enable SMS permission in app settings to auto-track expenses.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Open Settings', onPress: () => openAppSettings() }
                        ]
                    );
                }
            }
        } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const openAppSettings = () => {
        if (Platform.OS === 'android') {
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                {
                    data: `package:${Application.applicationId}`,
                }
            );
        }
    };

    return (
        <View style={globalStyles.container}>
            <View style={styles.inner}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📱</Text>
                </View>

                <Text style={globalStyles.title}>SMS Permission</Text>

                <Text style={styles.description}>
                    To automatically track your expenses from transaction messages,
                    we need access to your SMS. Your data is encrypted and never shared.
                </Text>

                <View style={styles.permissionCard}>
                    <Text style={styles.permissionTitle}>We will:</Text>
                    <Text style={styles.permissionItem}>✓ Read transaction SMS only</Text>
                    <Text style={styles.permissionItem}>✓ Never share your data</Text>
                    <Text style={styles.permissionItem}>✓ Allow manual entry if denied</Text>
                </View>

                <Button
                    title="Allow SMS Access"
                    onPress={requestSMSPermission}
                    variant="accent"
                />

                <TouchableOpacity
                    onPress={() => navigation.replace('DateRange')}
                    style={styles.skipButton}
                >
                    <Text style={styles.skipText}>Skip for now (Manual entry)</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    Note: This app needs to be installed as a development build to read SMS.
                    You're using a {'development build'} ✓
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
        color: colors.success,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default PermissionsScreen;