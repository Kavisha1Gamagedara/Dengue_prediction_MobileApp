import { StyleSheet, Dimensions } from 'react-native';

export const authStyles = StyleSheet.create({
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
    // Register specific
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        alignSelf: 'flex-start',
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
});
