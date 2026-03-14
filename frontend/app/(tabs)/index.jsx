import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userInfoStr = await SecureStore.getItemAsync('userInfo');
                const token = await SecureStore.getItemAsync('userToken');
                
                if (!token) {
                    router.replace('/(auth)/login');
                    return;
                }

                if (userInfoStr) {
                    setUser(JSON.parse(userInfoStr));
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
        router.replace('/(auth)/login');
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <StatusBar style="auto" />

            {/* Custom Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: themeColors.icon }]}>Hello, {user?.name || 'User'}</Text>
                    <Text style={[styles.title, { color: themeColors.text }]}>Stay Safe Today</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => router.push('/(tabs)/profile')}
                    style={[styles.profileButton, { backgroundColor: themeColors.surface }]}
                >
                    <IconSymbol name="person.fill" size={24} color={themeColors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Risk Level Card */}
                <Card style={styles.riskCard}>
                    <LinearGradient
                        colors={[themeColors.primary, '#C0392B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBg}
                    />
                    <View style={styles.riskHeader}>
                        <View style={styles.riskInfo}>
                            <Text style={styles.riskLabel}>Current Risk Level</Text>
                            <Text style={styles.riskValue}>Moderate</Text>
                        </View>
                        <View style={styles.riskIconContainer}>
                            <IconSymbol name="exclamationmark.shield.fill" size={32} color="#FFF" />
                        </View>
                    </View>
                    <Text style={styles.riskDesc}>
                        Case numbers are increasing in your area. Ensure you have mosquito protection.
                    </Text>
                </Card>

                {/* Quick Actions */}
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <ActionItem
                        icon="doc.text.fill"
                        title="Report Case"
                        color="#4A90E2"
                        themeColors={themeColors}
                    />
                    <ActionItem
                        icon="chart.bar.fill"
                        title="Prediction"
                        color="#8A232E"
                        themeColors={themeColors}
                    />
                    <ActionItem
                        icon="hand.raised.fill"
                        title="Prevention"
                        color="#2ECC71"
                        themeColors={themeColors}
                    />
                    <ActionItem
                        icon="bell.fill"
                        title="Alerts"
                        color="#F1C40F"
                        themeColors={themeColors}
                    />
                </View>

                {/* Statistics Section */}
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Area Statistics</Text>
                <Card variant="outlined" style={styles.statsCard}>
                    <View style={styles.statRow}>
                        <StatItem label="Active Cases" value="24" color="#FF4757" />
                        <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                        <StatItem label="Recovered" value="156" color="#2ECC71" />
                        <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                        <StatItem label="Risk Area" value="Zone B" color="#F1C40F" />
                    </View>
                </Card>

                {/* Tip of the Day */}
                <Card style={styles.tipCard}>
                    <View style={styles.tipContent}>
                        <IconSymbol name="lightbulb.fill" size={24} color={themeColors.primary} />
                        <View style={styles.tipTextContainer}>
                            <Text style={[styles.tipTitle, { color: themeColors.text }]}>Pro Tip</Text>
                            <Text style={[styles.tipDesc, { color: themeColors.icon }]}>
                                Empty stagnant water from flower pots every week to prevent mosquito breeding.
                            </Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

function ActionItem({ icon, title, color, themeColors }) {
    return (
        <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
                <IconSymbol name={icon} size={28} color={color} />
            </View>
            <Text style={[styles.actionLabel, { color: themeColors.text }]}>{title}</Text>
        </TouchableOpacity>
    );
}

function StatItem({ label, value, color }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
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
    greeting: {
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    riskCard: {
        height: 180,
        marginBottom: 32,
        justifyContent: 'center',
    },
    gradientBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    riskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    riskInfo: {},
    riskLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    riskValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
    },
    riskIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    riskDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32,
    },
    actionItem: {
        width: (width - 64) / 2,
        alignItems: 'center',
        gap: 12,
    },
    actionIcon: {
        width: '100%',
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    statsCard: {
        marginBottom: 32,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    statDivider: {
        width: 1,
        height: 40,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#95A5A6',
        marginBottom: 4,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    tipCard: {
        padding: 16,
    },
    tipContent: {
        flexDirection: 'row',
        gap: 16,
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    tipDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
});
