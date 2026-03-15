import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const Button = ({ title, onPress, variant = 'primary', style }) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'secondary':
                return colors.secondary;
            case 'accent':
                return colors.accent;
            case 'highlight':
                return colors.highlight;
            default:
                return colors.primary;
        }
    };

    return (
        <TouchableOpacity
            style={[
                globalStyles.button,
                { backgroundColor: getBackgroundColor() },
                style,
            ]}
            onPress={onPress}
        >
            <Text style={globalStyles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;