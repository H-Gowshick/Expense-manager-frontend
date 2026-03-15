import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Button from '../components/Button';
import { storeTokens } from '../services/api';

// Temporary OTP verification (since backend doesn't have OTP endpoint yet)
// In production, you'll call your OTP verification API
const verifyOTP = async (emailOrPhno, otp) => {
    // Mock verification - in real app, call your OTP API
    return new Promise((resolve) => {
        setTimeout(() => {
            // For testing, accept any 4-digit OTP
            if (otp.length === 4) {
                resolve({
                    success: true,
                    data: {
                        accessToken: 'mock-access-token',
                        refreshToken: 'mock-refresh-token',
                    },
                });
            } else {
                resolve({
                    success: false,
                    error: 'Invalid OTP',
                });
            }
        }, 1000);
    });
};

const OtpScreen = ({ navigation, route }) => {
    const { emailOrPhno } = route.params;
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            Alert.alert('Error', 'Please enter 4-digit OTP');
            return;
        }

        setLoading(true);

        // Call OTP verification
        const result = await verifyOTP(emailOrPhno, otpString);

        setLoading(false);

        if (result.success) {
            // Store tokens if your API returns them
            if (result.data?.accessToken) {
                await storeTokens(result.data.accessToken, result.data.refreshToken);
            }

            // Navigate to permissions screen
            navigation.replace('Permissions');
        } else {
            Alert.alert('Verification Failed', result.error || 'Invalid OTP');
            // Clear OTP fields
            setOtp(['', '', '', '']);
            inputRefs.current[0].focus();
        }
    };

    const handleResendOTP = () => {
        if (canResend) {
            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '']);
            Alert.alert('OTP Resent', 'A new OTP has been sent to your device');
            // In real app, call resend OTP API
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <View style={styles.inner}>
                <View style={styles.header}>
                    <Text style={globalStyles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                        Enter the 4-digit code sent to {emailOrPhno}
                    </Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            editable={!loading}
                        />
                    ))}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.accent} />
                ) : (
                    <Button
                        title="Verify OTP"
                        onPress={handleVerifyOTP}
                        variant="accent"
                    />
                )}

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Didn't receive code?{' '}
                        {canResend ? (
                            <Text style={styles.resendLink} onPress={handleResendOTP}>
                                Resend
                            </Text>
                        ) : (
                            <Text style={styles.timerText}>Resend in {timer}s</Text>
                        )}
                    </Text>
                </View>
            </View>
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: colors.secondary,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        color: colors.primary,
    },
    resendContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resendText: {
        color: colors.gray,
        fontSize: 14,
    },
    resendLink: {
        color: colors.accent,
        fontWeight: 'bold',
        fontSize: 14,
    },
    timerText: {
        color: colors.secondary,
        fontSize: 14,
    },
});

export default OtpScreen;