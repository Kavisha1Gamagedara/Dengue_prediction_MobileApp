import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';
import { authStyles as styles } from '@/styles/authStyles';
import { useTranslation } from '@/hooks/LanguageContext';


export default function LoginScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t, lang, changeLanguage } = useTranslation();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        console.log(`Attempting login at: ${API_BASE_URL}/login`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok) {
                // Store the token
                await SecureStore.setItemAsync('userToken', data.access_token);
                // Optionally store user info
                await SecureStore.setItemAsync('userInfo', JSON.stringify(data.user));
                
                if (data.user?.is_new_user) {
                    router.replace('/onboarding');
                } else {
                    router.replace('/(tabs)');
                }
            } else {
                console.warn('Login response not OK:', data);
                Alert.alert('Login Failed', data.message || 'Invalid credentials');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                Alert.alert('Connection Timeout', 'The server took too long to respond. Please check if your backend is running at ' + API_BASE_URL);
            } else {
                console.error('Login error detail:', error);
                Alert.alert('Error', 'Could not connect to the server. Technical detail: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: themeColors.background }]}
        >
            <View style={loginPageStyles.langSelector}>
                <TouchableOpacity onPress={() => changeLanguage('en')} style={[loginPageStyles.langBtn, lang === 'en' && loginPageStyles.activeLang]}>
                    <Text style={[loginPageStyles.langText, { color: lang === 'en' ? themeColors.primary : themeColors.icon }]}>EN</Text>
                </TouchableOpacity>
                <View style={[loginPageStyles.divider, { backgroundColor: themeColors.border }]} />
                <TouchableOpacity onPress={() => changeLanguage('si')} style={[loginPageStyles.langBtn, lang === 'si' && loginPageStyles.activeLang]}>
                    <Text style={[loginPageStyles.langText, { color: lang === 'si' ? themeColors.primary : themeColors.icon }]}>සිංහල</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('@/assets/logo2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: themeColors.text }]}>{t('welcome_back')}</Text>
                    <Image
                        source={require('@/assets/SLflag.png')}
                        style={styles.slFlag}
                        resizeMode="contain"
                    />
                    <Text style={[styles.subtitle, { color: themeColors.icon }]}>
                        {t('login_subtitle')}
                    </Text>
                </View>


                <View style={styles.form}>
                    <Input
                        label={t('email')}
                        placeholder="example@mail.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label={t('password')}
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={{ color: themeColors.primary, fontWeight: '600' }}>{t('forgot_password')}</Text>
                    </TouchableOpacity>

                    <Button
                        title={loading ? t('connecting') : t('connect')}
                        onPress={handleLogin}
                        disabled={loading}
                        style={styles.loginButton}
                        icon={loading ? <ActivityIndicator color="#fff" size="small" /> : null}
                    />

                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                        <Text style={[styles.dividerText, { color: themeColors.icon }]}>{t('or')}</Text>
                        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                    </View>

                    <View style={styles.socialContainer}>
                        <Button
                            variant="outline"
                            title={t('signin_google')}
                            onPress={() => { }}
                            style={styles.socialButton}
                            icon={<IconSymbol name="g.circle.fill" size={20} color={themeColors.primary} />}
                        />
                        <Button
                            variant="outline"
                            title={t('signin_facebook')}
                            onPress={() => { }}
                            style={styles.socialButton}
                            icon={<IconSymbol name="f.circle.fill" size={20} color={themeColors.primary} />}
                        />
                    </View>


                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: themeColors.icon }]}>
                            {t('no_account')}
                        </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={[styles.footerLink, { color: themeColors.primary }]}> {t('signup')}</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Internal styles removed, now using external authStyles
const loginPageStyles = StyleSheet.create({
    langSelector: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 100,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    langBtn: {
        paddingHorizontal: 8,
    },
    langText: {
        fontSize: 14,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 14,
        marginHorizontal: 4,
    },
    activeLang: {
        // Optional active state styling
    }
});
import { StyleSheet } from 'react-native';

