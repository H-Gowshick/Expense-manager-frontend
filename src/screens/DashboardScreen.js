import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import ExpenseCard from '../components/ExpenseCard';
import Button from '../components/Button';

const DashboardScreen = ({ navigation }) => {
    const [dateRange, setDateRange] = useState({
        start: '01 Mar 2026',
        end: '04 Mar 2026',
    });

    // Sample data - In real app, this would come from SMS parsing
    const stats = {
        totalIncome: 45000,
        totalExpense: 28350,
        balance: 16650,
        categories: [
            { name: 'Food', amount: 8500, icon: '🍔', color: '#E6501B' },
            { name: 'Transport', amount: 3500, icon: '🚗', color: '#C3110C' },
            { name: 'Shopping', amount: 6200, icon: '🛍️', color: '#740A03' },
            { name: 'Entertainment', amount: 4150, icon: '🎮', color: '#280905' },
            { name: 'Bills', amount: 6000, icon: '📱', color: '#E6501B' },
        ],
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, User! 👋</Text>
                        <Text style={styles.dateRange}>
                            {dateRange.start} - {dateRange.end}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.calendarButton}
                        onPress={() => navigation.navigate('DateRange')}
                    >
                        <Text style={styles.calendarIcon}>📅</Text>
                    </TouchableOpacity>
                </View>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceAmount}>₹{stats.balance.toLocaleString()}</Text>
                    <View style={styles.balanceRow}>
                        <View style={styles.incomeItem}>
                            <Text style={styles.incomeLabel}>Income</Text>
                            <Text style={styles.incomeAmount}>+₹{stats.totalIncome.toLocaleString()}</Text>
                        </View>
                        <View style={styles.expenseItem}>
                            <Text style={styles.expenseLabel}>Expenses</Text>
                            <Text style={styles.expenseAmount}>-₹{stats.totalExpense.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Budget')}
                    >
                        <Text style={styles.actionIcon}>🎯</Text>
                        <Text style={styles.actionText}>Set Budget</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionIcon}>➕</Text>
                        <Text style={styles.actionText}>Add Manual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionIcon}>📊</Text>
                        <Text style={styles.actionText}>Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionIcon}>🔔</Text>
                        <Text style={styles.actionText}>Alerts</Text>
                    </TouchableOpacity>
                </View>

                {/* Expense Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expenses by Category</Text>
                    {stats.categories.map((category, index) => (
                        <ExpenseCard
                            key={index}
                            category={category.name}
                            amount={category.amount}
                            icon={category.icon}
                            color={category.color}
                        />
                    ))}
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <View style={[styles.transactionIcon, { backgroundColor: '#E6501B20' }]}>
                                <Text style={styles.transactionEmoji}>🍔</Text>
                            </View>
                            <View>
                                <Text style={styles.transactionName}>Lunch</Text>
                                <Text style={styles.transactionDate}>Today, 1:30 PM</Text>
                            </View>
                        </View>
                        <Text style={styles.transactionAmount}>-₹450</Text>
                    </View>
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <View style={[styles.transactionIcon, { backgroundColor: '#740A0320' }]}>
                                <Text style={styles.transactionEmoji}>🚕</Text>
                            </View>
                            <View>
                                <Text style={styles.transactionName}>Uber</Text>
                                <Text style={styles.transactionDate}>Yesterday, 9:15 AM</Text>
                            </View>
                        </View>
                        <Text style={styles.transactionAmount}>-₹250</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    dateRange: {
        fontSize: 14,
        color: colors.secondary,
        marginTop: 4,
    },
    calendarButton: {
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    calendarIcon: {
        fontSize: 24,
    },
    balanceCard: {
        backgroundColor: colors.primary,
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    balanceLabel: {
        color: colors.white + '80',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: colors.white,
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    incomeItem: {
        flex: 1,
    },
    expenseItem: {
        flex: 1,
        alignItems: 'flex-end',
    },
    incomeLabel: {
        color: colors.white + '80',
        fontSize: 12,
    },
    incomeAmount: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: 'bold',
    },
    expenseLabel: {
        color: colors.white + '80',
        fontSize: 12,
    },
    expenseAmount: {
        color: '#F44336',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    actionText: {
        fontSize: 12,
        color: colors.secondary,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionEmoji: {
        fontSize: 20,
    },
    transactionName: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '500',
    },
    transactionDate: {
        fontSize: 12,
        color: colors.gray,
    },
    transactionAmount: {
        fontSize: 16,
        color: colors.error,
        fontWeight: '600',
    },
});

export default DashboardScreen;