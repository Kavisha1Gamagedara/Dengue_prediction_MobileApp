import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    mapPlaceholder: {
        height: height * 0.45,
        marginHorizontal: 24,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    mapGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    marker: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 12,
        borderRadius: 16,
    },
    mapStatus: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    legendContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendLabel: {
        fontSize: 13,
        color: '#95A5A6',
        fontWeight: '600',
    },
    infoCard: {
        marginHorizontal: 24,
        padding: 16,
    },
    infoContent: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    infoDesc: {
        fontSize: 14,
    },
});
