import React from 'react';
import {
    View,
    Text,
    StyleSheet,
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

export default function RegisterScreen() {
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
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButton, { backgroundColor: themeColors.surface }]}
                    >
                        <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: themeColors.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: themeColors.icon }]}>
                        Join the community and stay protected from Dengue.
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                    />
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
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <View style={styles.termsContainer}>
                        <Text style={[styles.termsText, { color: themeColors.icon }]}>
                            By signing up, you agree to our
                            <Text style={{ color: themeColors.primary, fontWeight: '600' }}> Terms of Use </Text>
                            and
                            <Text style={{ color: themeColors.primary, fontWeight: '600' }}> Privacy Policy</Text>.
                        </Text>
                    </View>

                    <Button
                        title="Create Account"
                        onPress={() => router.replace('/(tabs)')}
                        style={styles.registerButton}
                    />

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: themeColors.icon }]}>
                            Already have an account?
                        </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text style={[styles.footerLink, { color: themeColors.primary }]}> Log In</Text>
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
        marginBottom: 40,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    termsContainer: {
        marginBottom: 32,
        paddingRight: 20,
    },
    termsText: {
        fontSize: 13,
        lineHeight: 18,
    },
    registerButton: {
        marginBottom: 32,
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
