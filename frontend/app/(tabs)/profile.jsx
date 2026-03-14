import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                router.replace('/(auth)/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setName(data.name);
                setEmail(data.email);
            } else {
                Alert.alert('Error', 'Could not load profile');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!name) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setUpdating(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
                // Update local storage
                const userInfoStr = await SecureStore.getItemAsync('userInfo');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    userInfo.name = name;
                    await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
                }
            } else {
                Alert.alert('Error', 'Update failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to server');
        } finally {
            setUpdating(false);
        }
    };

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
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: themeColors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.avatarCircle, { backgroundColor: themeColors.primary + '20' }]}>
                        <IconSymbol name="person.fill" size={60} color={themeColors.primary} />
                    </View>
                    <Text style={[styles.userName, { color: themeColors.text }]}>{name}</Text>
                    <Text style={[styles.userEmail, { color: themeColors.icon }]}>{email}</Text>
                </View>

                <Card style={styles.formCard}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Edit Details</Text>
                    <Input
                        label="Full Name"
                        placeholder="Your Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        label="Email Address"
                        value={email}
                        editable={false}
                        containerStyle={{ opacity: 0.7 }}
                    />
                    
                    <Button
                        title={updating ? "Updating..." : "Save Changes"}
                        onPress={handleUpdate}
                        disabled={updating}
                        style={styles.saveButton}
                    />
                </Card>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionRow}>
                        <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                            <IconSymbol name="shield.fill" size={20} color="#2ECC71" />
                        </View>
                        <Text style={[styles.actionText, { color: themeColors.text }]}>Privacy Settings</Text>
                        <IconSymbol name="chevron.right" size={20} color={themeColors.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionRow}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                            <IconSymbol name="bell.fill" size={20} color="#F39C12" />
                        </View>
                        <Text style={[styles.actionText, { color: themeColors.text }]}>Notification Prefs</Text>
                        <IconSymbol name="chevron.right" size={20} color={themeColors.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionRow, styles.logoutRow]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FF4757" />
                        </View>
                        <Text style={[styles.actionText, { color: '#FF4757' }]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        fontWeight: '500',
    },
    formCard: {
        padding: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    saveButton: {
        marginTop: 8,
    },
    actionsContainer: {
        gap: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    logoutRow: {
        marginTop: 12,
    }
});
