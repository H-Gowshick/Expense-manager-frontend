import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';

const TestLoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        if (!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        // Validate phone number (simple validation for testing)
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        if (cleanNumber.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        // Navigate to OTP screen with phone number
        navigation.navigate('TestOtp', { phoneNumber: cleanNumber });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <View style={styles.header}>
                        <Text style={globalStyles.title}>Welcome Back! 👋</Text>
                        <Text style={styles.subtitle}>
                            Enter your phone number to receive OTP
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter your 10-digit mobile number"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        <Button
                            title="Get OTP"
                            onPress={handleLogin}
                            variant="accent"
                        />

                        <View style={styles.testInfo}>
                            <Text style={styles.testInfoText}>
                                🔧 Test Mode: Any 10-digit number works
                            </Text>
                            <Text style={styles.testInfoText}>
                                OTP will be shown on next screen
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondary,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    testInfo: {
        marginTop: 30,
        padding: 15,
        backgroundColor: colors.highlight + '20',
        borderRadius: 8,
        alignItems: 'center',
    },
    testInfoText: {
        color: colors.primary,
        fontSize: 14,
        marginBottom: 5,
    },
});

export default TestLoginScreen;