import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { dashboardStyles as styles } from '@/styles/dashboardStyles';
import { useTranslation } from '@/hooks/LanguageContext';


export default function DashboardScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t } = useTranslation();

    
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

            <Image 
                source={require('@/assets/SLlion2.png')}
                style={styles.backgroundLion}
                resizeMode="contain"
            />

            {/* Custom Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: themeColors.icon }]}>{t('hello')}, {user?.name || 'User'}</Text>
                    <Text style={[styles.title, { color: themeColors.text }]}>{t('stay_safe_today')}</Text>
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
                        colors={[themeColors.secondary || '#7E1C25', '#C0392B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBg}
                    />
                    <View style={styles.riskHeader}>
                        <View style={styles.riskInfo}>
                            <Text style={styles.riskLabel}>{t('current_risk_level')}</Text>
                            <Text style={styles.riskValue}>{t('moderate')}</Text>
                        </View>
                        <View style={styles.riskIconContainer}>
                            <IconSymbol name="exclamationmark.shield.fill" size={32} color="#FFF" />
                        </View>
                    </View>
                    <Text style={styles.riskDesc}>
                        {t('risk_desc')}
                    </Text>

                </Card>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('quick_actions')}</Text>
                    <View style={styles.actionGrid}>
                        <ActionItem
                            icon="doc.text.fill"
                            title={t('report_case')}
                            color="#4A90E2"
                            themeColors={themeColors}
                        />
                        <ActionItem
                            icon="chart.bar.fill"
                            title={t('prediction')}
                            color={themeColors.primary}
                            themeColors={themeColors}
                        />
                        <ActionItem
                            icon="hand.raised.fill"
                            title={t('prevention')}
                            color="#2ECC71"
                            themeColors={themeColors}
                        />
                        <ActionItem
                            icon="bell.fill"
                            title={t('alerts')}
                            color="#F1C40F"
                            themeColors={themeColors}
                        />
                    </View>
                </View>


                {/* Statistics Section */}
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('area_statistics')}</Text>
                <Card variant="outlined" style={styles.statsCard}>

                    <View style={styles.statRow}>
                        <StatItem label={t('active_cases')} value="24" color="#FF4757" />
                        <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                        <StatItem label={t('recovered')} value="156" color="#2ECC71" />
                        <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                        <StatItem label={t('risk_area')} value="Zone B" color="#F1C40F" />
                    </View>
                </Card>


                {/* Tip of the Day */}
                <Card style={styles.tipCard}>
                    <View style={styles.tipContent}>
                        <IconSymbol name="lightbulb.fill" size={24} color={themeColors.primary} />
                        <View style={styles.tipTextContainer}>
                            <Text style={[styles.tipTitle, { color: themeColors.text }]}>{t('pro_tip')}</Text>
                            <Text style={[styles.tipDesc, { color: themeColors.icon }]}>
                                {t('tip_desc')}
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

// Internal styles removed, now using external dashboardStyles

