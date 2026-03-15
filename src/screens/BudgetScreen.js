import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Modal,
} from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import BudgetCard from '../components/BudgetCard';
import Button from '../components/Button';
import { checkBudgetAndAlert, scheduleDailySummary } from '../services/notificationService';

const BudgetScreen = ({ navigation }) => {
    const [budgets, setBudgets] = useState([
        {
            id: '1',
            category: 'Food',
            monthly: 5000,
            daily: 200,
            spent: 3850,
            dailySpent: 180,
            icon: '🍔',
            color: '#E6501B',
        },
        {
            id: '2',
            category: 'Transport',
            monthly: 3000,
            daily: 150,
            spent: 2450,
            dailySpent: 120,
            icon: '🚗',
            color: '#C3110C',
        },
        {
            id: '3',
            category: 'Entertainment',
            monthly: 4000,
            daily: 150,
            spent: 4150,
            dailySpent: 200,
            icon: '🎮',
            color: '#740A03',
        },
        {
            id: '4',
            category: 'Shopping',
            monthly: 6000,
            daily: 250,
            spent: 3200,
            dailySpent: 0,
            icon: '🛍️',
            color: '#280905',
        },
        {
            id: '5',
            category: 'Bills',
            monthly: 8000,
            daily: 300,
            spent: 6000,
            dailySpent: 0,
            icon: '📱',
            color: '#E6501B',
        },
    ]);

    const [alerts, setAlerts] = useState([
        {
            id: 1,
            title: 'EMI Payment - Bike Loan',
            date: '10 Mar 2026',
            amount: 4500,
            type: 'emi',
        },
        {
            id: 2,
            title: 'Settlement due - Rahul',
            date: '15 Mar 2026',
            amount: 2000,
            type: 'settlement',
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [newMonthly, setNewMonthly] = useState('');
    const [newDaily, setNewDaily] = useState('');

    // Check budgets on mount
    useEffect(() => {
        checkAllBudgets();
        scheduleDailySummary();
    }, []);

    const checkAllBudgets = async () => {
        for (const budget of budgets) {
            await checkBudgetAndAlert(
                budget.category,
                budget.spent,
                budget.monthly,
                budget.daily,
                budget.dailySpent
            );
        }
    };

    const handleEditBudget = (budget) => {
        setEditingBudget(budget);
        setNewMonthly(budget.monthly.toString());
        setNewDaily(budget.daily.toString());
        setModalVisible(true);
    };

    const handleSaveBudget = async () => {
        if (!newMonthly || !newDaily) {
            Alert.alert('Error', 'Please enter both monthly and daily budgets');
            return;
        }

        const monthly = parseFloat(newMonthly);
        const daily = parseFloat(newDaily);

        if (isNaN(monthly) || monthly <= 0) {
            Alert.alert('Error', 'Please enter a valid monthly budget');
            return;
        }

        if (isNaN(daily) || daily <= 0) {
            Alert.alert('Error', 'Please enter a valid daily budget');
            return;
        }

        const updatedBudgets = budgets.map(b =>
            b.id === editingBudget.id
                ? { ...b, monthly, daily }
                : b
        );

        setBudgets(updatedBudgets);
        setModalVisible(false);

        // Check if new budget triggers any alerts
        const updatedBudget = { ...editingBudget, monthly, daily };
        await checkBudgetAndAlert(
            updatedBudget.category,
            updatedBudget.spent,
            updatedBudget.monthly,
            updatedBudget.daily,
            updatedBudget.dailySpent
        );

        Alert.alert('Success', 'Budget updated successfully!');
    };

    const handleAddAlert = () => {
        Alert.prompt(
            'Add New Alert',
            'Enter alert title',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Next',
                    onPress: (title) => {
                        if (!title) return;

                        Alert.prompt(
                            'Enter Amount',
                            'Enter amount for this alert',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Add',
                                    onPress: (amountStr) => {
                                        const amount = parseFloat(amountStr);
                                        if (isNaN(amount) || amount <= 0) {
                                            Alert.alert('Error', 'Please enter a valid amount');
                                            return;
                                        }

                                        const newAlert = {
                                            id: alerts.length + 1,
                                            title,
                                            date: new Date().toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            }),
                                            amount,
                                            type: 'manual',
                                        };

                                        setAlerts([...alerts, newAlert]);
                                        Alert.alert('Success', 'Alert added successfully!');
                                    },
                                },
                            ],
                            'plain-text'
                        );
                    },
                },
            ],
            'plain-text'
        );
    };

    const handleDeleteAlert = (alertId) => {
        Alert.alert(
            'Delete Alert',
            'Are you sure you want to delete this alert?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setAlerts(alerts.filter(a => a.id !== alertId));
                    },
                },
            ]
        );
    };

    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.monthly, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const spentPercentage = Math.round((totalSpent / totalMonthlyBudget) * 100);

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={globalStyles.title}>Budget Planner</Text>
                    <Text style={styles.subtitle}>
                        Set monthly and daily budgets for each category
                    </Text>
                </View>

                {/* Budget Overview */}
                <View style={styles.overviewCard}>
                    <Text style={styles.overviewTitle}>Total Monthly Budget</Text>
                    <Text style={styles.overviewAmount}>₹{totalMonthlyBudget.toLocaleString()}</Text>
                    <Text style={styles.overviewSpent}>
                        Spent: ₹{totalSpent.toLocaleString()} ({spentPercentage}%)
                    </Text>
                    <View style={styles.progressContainer}>
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width: `${Math.min(spentPercentage, 100)}%`,
                                    backgroundColor: spentPercentage > 100 ? colors.error : colors.accent
                                }
                            ]}
                        />
                    </View>
                    {spentPercentage > 100 && (
                        <Text style={styles.overBudgetText}>
                            ⚠️ You've exceeded your total budget by ₹{(totalSpent - totalMonthlyBudget).toLocaleString()}
                        </Text>
                    )}
                </View>

                {/* Category Budgets */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Category Budgets</Text>
                        <TouchableOpacity>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    {budgets.map((budget) => (
                        <TouchableOpacity
                            key={budget.id}
                            onPress={() => handleEditBudget(budget)}
                            activeOpacity={0.7}
                        >
                            <BudgetCard
                                category={budget.category}
                                monthly={budget.monthly}
                                daily={budget.daily}
                                spent={budget.spent}
                                icon={budget.icon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Alerts Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Payment Alerts</Text>
                        <TouchableOpacity onPress={handleAddAlert}>
                            <Text style={styles.addText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    {alerts.map((alert) => (
                        <View key={alert.id} style={styles.alertCard}>
                            <View style={styles.alertHeader}>
                                <View style={styles.alertType}>
                                    <Text style={styles.alertIcon}>
                                        {alert.type === 'emi' ? '💰' : alert.type === 'settlement' ? '🤝' : '📅'}
                                    </Text>
                                    <Text style={styles.alertTitle}>{alert.title}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteAlert(alert.id)}>
                                    <Text style={styles.deleteText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.alertDetails}>
                                <Text style={styles.alertDate}>Due: {alert.date}</Text>
                                <Text style={styles.alertAmount}>₹{alert.amount.toLocaleString()}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Save Budget Settings"
                        onPress={() => {
                            Alert.alert('Success', 'Budget settings saved!');
                            navigation.goBack();
                        }}
                        variant="accent"
                    />
                </View>
            </ScrollView>

            {/* Edit Budget Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Edit {editingBudget?.category} Budget
                        </Text>

                        <Text style={styles.modalLabel}>Monthly Budget (₹)</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newMonthly}
                            onChangeText={setNewMonthly}
                            keyboardType="numeric"
                            placeholder="Enter monthly budget"
                        />

                        <Text style={styles.modalLabel}>Daily Budget (₹)</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newDaily}
                            onChangeText={setNewDaily}
                            keyboardType="numeric"
                            placeholder="Enter daily budget"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveBudget}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondary,
        marginTop: 4,
    },
    overviewCard: {
        backgroundColor: colors.white,
        margin: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    overviewTitle: {
        fontSize: 14,
        color: colors.secondary,
        marginBottom: 8,
    },
    overviewAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    overviewSpent: {
        fontSize: 14,
        color: colors.secondary,
        marginBottom: 12,
    },
    progressContainer: {
        height: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 4,
    },
    overBudgetText: {
        fontSize: 14,
        color: colors.error,
        fontWeight: 'bold',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    editText: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    addText: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    alertCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    alertType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    deleteText: {
        fontSize: 16,
        color: colors.error,
    },
    alertDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alertDate: {
        fontSize: 14,
        color: colors.secondary,
    },
    alertAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.accent,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalLabel: {
        fontSize: 14,
        color: colors.secondary,
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        color: colors.primary,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.lightGray,
    },
    saveButton: {
        backgroundColor: colors.accent,
    },
    cancelButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BudgetScreen;