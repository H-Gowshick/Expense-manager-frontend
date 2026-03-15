import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.secondary,
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        color: colors.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 16,
        color: colors.primary,
    },
    button: {
        backgroundColor: colors.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});