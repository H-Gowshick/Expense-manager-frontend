import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Button from '../components/Button';

const DateRangeScreen = ({ navigation }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const getCurrentMonthStart = () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const handleProceed = () => {
        navigation.replace('Dashboard');
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <View style={globalStyles.container}>
            <View style={styles.inner}>
                <View style={styles.header}>
                    <Text style={globalStyles.title}>Select Date Range</Text>
                    <Text style={styles.subtitle}>
                        Choose the period for which you want to track expenses
                    </Text>
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.label}>Start Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowStartPicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>End Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowEndPicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>📌 Quick Tips</Text>
                    <Text style={styles.infoText}>
                        • Select exact dates to match your salary cycle
                    </Text>
                    <Text style={styles.infoText}>
                        • Default is current month (1st to today)
                    </Text>
                    <Text style={styles.infoText}>
                        • You can change this anytime from dashboard
                    </Text>
                </View>

                <Button
                    title="Fetch Transactions"
                    onPress={handleProceed}
                    variant="accent"
                />

                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowStartPicker(false);
                            if (selectedDate) setStartDate(selectedDate);
                        }}
                    />
                )}

                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowEndPicker(false);
                            if (selectedDate) setEndDate(selectedDate);
                        }}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondary,
        lineHeight: 24,
    },
    dateContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 12,
        padding: 16,
        backgroundColor: colors.white,
    },
    dateText: {
        fontSize: 18,
        color: colors.primary,
    },
    infoCard: {
        backgroundColor: colors.highlight + '10',
        borderRadius: 16,
        padding: 20,
        marginVertical: 30,
        borderWidth: 1,
        borderColor: colors.highlight + '30',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: colors.secondary,
        marginBottom: 8,
        lineHeight: 20,
    },
});

export default DateRangeScreen;