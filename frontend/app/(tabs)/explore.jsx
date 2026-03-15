import React from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { exploreStyles as styles } from '@/styles/exploreStyles';

export default function ExploreScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.text }]}>Global Risk Map</Text>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: themeColors.surface }]}>
                    <IconSymbol name="chevron.right" size={20} color={themeColors.text} />
                    <Text style={[styles.filterText, { color: themeColors.text }]}>Filters</Text>
                </TouchableOpacity>
            </View>

            {/* Mock Map View */}
            <View style={[styles.mapPlaceholder, { backgroundColor: themeColors.surface }]}>
                <LinearGradient
                    colors={['#E3F2FD', '#BBDEFB']}
                    style={styles.mapGradient}
                />
                {/* Mock Data Points */}
                <RiskMarker top="30%" left="40%" level="high" />
                <RiskMarker top="50%" left="60%" level="low" />
                <RiskMarker top="45%" left="20%" level="medium" />
                <RiskMarker top="70%" left="50%" level="high" />

                <View style={styles.mapOverlay}>
                    <Text style={[styles.mapStatus, { color: themeColors.icon }]}>
                        Showing live dengue risk clusters in your region.
                    </Text>
                </View>
            </View>

            <View style={styles.legendContainer}>
                <Text style={[styles.legendTitle, { color: themeColors.text }]}>Risk Legend</Text>
                <View style={styles.legendRow}>
                    <LegendItem color="#FF4757" label="High Risk" />
                    <LegendItem color="#F1C40F" label="Medium Risk" />
                    <LegendItem color="#2ECC71" label="Low Risk" />
                </View>
            </View>

            <Card style={styles.infoCard}>
                <View style={styles.infoContent}>
                    <IconSymbol name="exclamationmark.shield.fill" size={24} color={themeColors.primary} />
                    <View>
                        <Text style={[styles.infoTitle, { color: themeColors.text }]}>Safety Alert</Text>
                        <Text style={[styles.infoDesc, { color: themeColors.icon }]}>
                            High activity detected in Colombo North.
                        </Text>
                    </View>
                </View>
            </Card>
        </View>
    );
}

function RiskMarker({ top, left, level }) {
    const color = level === 'high' ? '#FF4757' : level === 'medium' ? '#F1C40F' : '#2ECC71';
    return (
        <View style={[styles.marker, { top, left, backgroundColor: color + '40', borderColor: color }]}>
            <View style={[styles.markerDot, { backgroundColor: color }]} />
        </View>
    );
}

function LegendItem({ color, label }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );
}

// Internal styles removed, now using external exploreStyles

