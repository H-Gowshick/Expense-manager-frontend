import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import { signup } from '../services/api';

const SignupScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        // Validation
        if (!formData.firstName.trim()) {
            Alert.alert('Error', 'Please enter your first name');
            return;
        }
        if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        setLoading(true);

        const result = await signup(formData);

        setLoading(false);

        if (result.success) {
            Alert.alert(
                'Success',
                'Account created successfully! Please login.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } else {
            Alert.alert('Signup Failed', result.error || 'Something went wrong');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.inner}>
                        <View style={styles.header}>
                            <Text style={globalStyles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Sign up to start tracking your expenses
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                                placeholder="Enter your first name"
                            />

                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                                placeholder="Enter your last name (optional)"
                            />

                            <Input
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                                placeholder="Enter 10-digit mobile number"
                                keyboardType="phone-pad"
                                maxLength={10}
                            />

                            <Input
                                label="Email"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            {loading ? (
                                <ActivityIndicator size="large" color={colors.accent} />
                            ) : (
                                <Button
                                    title="Sign Up"
                                    onPress={handleSignup}
                                    variant="accent"
                                />
                            )}

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginLink}>Login</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        padding: 24,
        paddingTop: 40,
    },
    header: {
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondary,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: colors.gray,
        fontSize: 14,
    },
    loginLink: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default SignupScreen;