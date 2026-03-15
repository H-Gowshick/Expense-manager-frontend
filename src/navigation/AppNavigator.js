import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import { isAuthenticated } from '../services/api';

import SplashScreen from '../screens/SplashScreen';
import TestLoginScreen from '../screens/TestLoginScreen';
import TestOtpScreen from '../screens/TestOtpScreen';
import NotificationPermissionsScreen from '../screens/NotificationPermissionsScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import DateRangeScreen from '../screens/DateRangeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BudgetScreen from '../screens/BudgetScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState('Splash');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For testing, always go to TestLogin after splash
        setTimeout(() => {
            setInitialRoute('TestLogin');
            setLoading(false);
        }, 2000);
    }, []);

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.white,
                    },
                    headerTintColor: colors.primary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TestLogin"
                    component={TestLoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TestOtp"
                    component={TestOtpScreen}
                    options={{ title: 'Verify OTP' }}
                />
                <Stack.Screen
                    name="NotificationPermissions"
                    component={NotificationPermissionsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Permissions"
                    component={PermissionsScreen}
                    options={{ title: 'SMS Access' }}
                />
                <Stack.Screen
                    name="DateRange"
                    component={DateRangeScreen}
                    options={{ title: 'Select Dates' }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Budget"
                    component={BudgetScreen}
                    options={{ title: 'Set Budget' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;