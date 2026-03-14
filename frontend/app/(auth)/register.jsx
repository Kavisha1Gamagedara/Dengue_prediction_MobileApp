import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';

export default function RegisterScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        console.log(`Attempting registration at: ${API_BASE_URL}/register`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully! Please log in.', [
                    { text: 'OK', onPress: () => router.push('/(auth)/login') }
                ]);
            } else {
                console.warn('Registration response not OK:', data);
                Alert.alert('Registration Failed', data.message || 'Could not register');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                Alert.alert('Connection Timeout', 'The server took too long to respond. Please check if your backend is running at ' + API_BASE_URL);
            } else {
                console.error('Registration error detail:', error);
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
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        label="Email Address"
                        placeholder="example@mail.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
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
                        title={loading ? "Creating Account..." : "Create Account"}
                        onPress={handleRegister}
                        disabled={loading}
                        style={styles.registerButton}
                        icon={loading ? <ActivityIndicator color="#fff" size="small" /> : null}
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
