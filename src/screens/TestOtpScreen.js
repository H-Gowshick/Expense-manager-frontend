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

// Simulate OTP sending
const sendOTP = async (phoneNumber) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In real app, this would call your backend
            console.log(`OTP sent to ${phoneNumber}: 1234`);
            resolve({ success: true, otp: '1234' });
        }, 1500);
    });
};

const TestOtpScreen = ({ navigation, route }) => {
    const { phoneNumber } = route.params || { phoneNumber: '+919876543210' };
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('1234'); // For testing
    const inputRefs = useRef([]);

    useEffect(() => {
        sendOtpToPhone();
    }, []);

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

    const sendOtpToPhone = async () => {
        setSendingOtp(true);
        const result = await sendOTP(phoneNumber);
        if (result.success) {
            setGeneratedOtp(result.otp);
            Alert.alert(
                'OTP Sent',
                `For testing, use OTP: ${result.otp}`,
                [{ text: 'OK' }]
            );
        }
        setSendingOtp(false);
    };

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

        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1000));

        setLoading(false);

        if (otpString === generatedOtp) {
            Alert.alert(
                'Success',
                'OTP verified successfully!',
                [{ text: 'Continue', onPress: () => navigation.replace('NotificationPermissions') }]
            );
        } else {
            Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '']);
            inputRefs.current[0].focus();
        }
    };

    const handleResendOTP = async () => {
        if (canResend) {
            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '']);
            await sendOtpToPhone();
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
                        Enter the 4-digit code sent to {phoneNumber}
                    </Text>
                </View>

                {sendingOtp ? (
                    <View style={styles.sendingContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.sendingText}>Sending OTP...</Text>
                    </View>
                ) : (
                    <>
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

                        <View style={styles.testInfo}>
                            <Text style={styles.testInfoText}>
                                🔧 Test Mode: Use OTP: {generatedOtp}
                            </Text>
                        </View>
                    </>
                )}
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
    sendingContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    sendingText: {
        marginTop: 10,
        color: colors.secondary,
        fontSize: 16,
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
        fontWeight: 'bold',
    },
});

export default TestOtpScreen;