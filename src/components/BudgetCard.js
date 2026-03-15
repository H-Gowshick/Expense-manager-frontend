import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const BudgetCard = ({ category, monthly, daily, spent, icon }) => {
    const progress = (spent / monthly) * 100;
    const isOverBudget = spent > monthly;

    return (
        <View style={[globalStyles.card, styles.container]}>
            <View style={globalStyles.row}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.category}>{category}</Text>
                    <View style={styles.budgetRow}>
                        <Text style={styles.budgetText}>Monthly: ₹{monthly}</Text>
                        <Text style={styles.budgetText}>Daily: ₹{daily}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
            </View>

            <View style={globalStyles.row}>
                <Text style={styles.spentText}>Spent: ₹{spent}</Text>
                <Text style={[styles.spentText, isOverBudget && styles.overBudget]}>
                    {isOverBudget ? 'Over Budget!' : `${Math.round(progress)}% used`}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.highlight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
    },
    infoContainer: {
        flex: 1,
    },
    category: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 4,
    },
    budgetRow: {
        flexDirection: 'row',
        gap: 16,
    },
    budgetText: {
        fontSize: 14,
        color: colors.secondary,
    },
    progressContainer: {
        height: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        marginVertical: 12,
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 4,
    },
    spentText: {
        fontSize: 14,
        color: colors.secondary,
    },
    overBudget: {
        color: colors.error,
        fontWeight: 'bold',
    },
});

export default BudgetCard;