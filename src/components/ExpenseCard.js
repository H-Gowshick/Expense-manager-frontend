import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const ExpenseCard = ({ category, amount, icon, color }) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={styles.category}>{category}</Text>
            </View>
            <Text style={styles.amount}>₹{amount.toLocaleString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    category: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '500',
    },
    amount: {
        fontSize: 16,
        color: colors.secondary,
        fontWeight: '600',
    },
});

export default ExpenseCard;