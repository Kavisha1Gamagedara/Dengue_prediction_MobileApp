import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { API_BASE_URL } from '@/constants/api';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        title: "Welcome to SecureKit",
        description: "Your advanced AI partner in predicting and preventing Dengue outbreaks in your local area.",
        icon: "shield.fill",
        color: "#4A90E2"
    },
    {
        title: "Stay Alerted",
        description: "Receive real-time notifications when risk levels rise. We use live weather data to keep you informed.",
        icon: "bell.fill",
        color: "#F1C40F"
    },
    {
        title: "Data-Driven Prediction",
        description: "Enter local environmental stats to get accurate risk levels and estimated case counts using our ML model.",
        icon: "chart.bar.fill",
        color: "#8A232E"
    }
];

export default function OnboardingFlow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    const handleNext = async () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // End of onboarding, mark as completed in backend
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ is_new_user: false }),
                });

                if (response.ok) {
                    // Update local user info if needed
                    const userInfoStr = await SecureStore.getItemAsync('userInfo');
                    if (userInfoStr) {
                        const userInfo = JSON.parse(userInfoStr);
                        userInfo.is_new_user = false;
                        await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
                    }
                    router.replace('/(tabs)');
                }
            } catch (error) {
                console.error('Onboarding update error:', error);
                router.replace('/(tabs)'); // Fallback
            } finally {
                setLoading(false);
            }
        }
    };

    const currentItem = ONBOARDING_DATA[currentIndex];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
                    <Text style={[styles.skipText, { color: themeColors.icon }]}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: currentItem.color + '20' }]}>
                    <IconSymbol name={currentItem.icon} size={80} color={currentItem.color} />
                </View>

                <Text style={[styles.title, { color: themeColors.text }]}>{currentItem.title}</Text>
                <Text style={[styles.description, { color: themeColors.icon }]}>
                    {currentItem.description}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === currentIndex ? themeColors.primary : themeColors.border },
                                index === currentIndex ? { width: 24 } : {}
                            ]}
                        />
                    ))}
                </View>

                <Button
                    title={loading ? "Starting..." : (currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next")}
                    onPress={handleNext}
                    disabled={loading}
                    style={styles.button}
                    icon={loading ? <ActivityIndicator color="#fff" size="small" /> : null}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'flex-end',
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 8,
    },
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
    },
    button: {
        width: '100%',
    },
});
