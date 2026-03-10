import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: themeColors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('@/assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: themeColors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: themeColors.icon }]}>
                        Log in to monitor and predict dengue risks in your area.
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email Address"
                        placeholder="example@mail.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={{ color: themeColors.primary, fontWeight: '600' }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Connect"
                        onPress={() => router.replace('/(tabs)')}
                        style={styles.loginButton}
                    />

                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                        <Text style={[styles.dividerText, { color: themeColors.icon }]}>Or</Text>
                        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                    </View>

                    <View style={styles.socialContainer}>
                        <Button
                            variant="outline"
                            title="Sign in with Google"
                            onPress={() => { }}
                            style={styles.socialButton}
                            icon={<IconSymbol name="g.circle.fill" size={20} color={themeColors.primary} />}
                        />
                        <Button
                            variant="outline"
                            title="Sign in with Facebook"
                            onPress={() => { }}
                            style={styles.socialButton}
                            icon={<IconSymbol name="f.circle.fill" size={20} color={themeColors.primary} />}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: themeColors.icon }]}>
                            Don't have an account?
                        </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={[styles.footerLink, { color: themeColors.primary }]}> Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
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
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    imageContainer: {
        width: 220,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        overflow: 'hidden',
    },
    logo: {
        width: 200,
        height: 160,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    loginButton: {
        marginBottom: 32,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '600',
    },
    socialContainer: {
        gap: 16,
        marginBottom: 40,
    },
    socialButton: {
        height: 50,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
    },
    footerLink: {
        fontSize: 15,
        fontWeight: '700',
    },
});
