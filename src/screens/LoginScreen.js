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
import { login } from '../services/api';

const LoginScreen = ({ navigation }) => {
    const [emailOrPhno, setEmailOrPhno] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!emailOrPhno.trim()) {
            Alert.alert('Error', 'Please enter your email or phone number');
            return;
        }

        setLoading(true);

        const result = await login(emailOrPhno);

        setLoading(false);

        if (result.success) {
            // Navigate to OTP screen with user info
            navigation.navigate('Otp', { emailOrPhno });
        } else {
            Alert.alert('Login Failed', result.error || 'User not found. Please sign up first.');
        }
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
                            Login to continue tracking your expenses
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email or Phone Number"
                            value={emailOrPhno}
                            onChangeText={setEmailOrPhno}
                            placeholder="Enter your email or phone number"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color={colors.accent} />
                        ) : (
                            <Button
                                title="Continue"
                                onPress={handleLogin}
                                variant="accent"
                            />
                        )}

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableWithoutFeedback>
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: colors.gray,
        fontSize: 14,
    },
    signupLink: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;