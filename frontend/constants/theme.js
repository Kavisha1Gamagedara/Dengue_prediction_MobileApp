import { Platform } from 'react-native';

export const Colors = {
    light: {
        text: '#2D3436',
        background: '#FFFFFF',
        primary: '#7E1C25', // Maroon
        secondary: '#4A90E2', // Medical Blue
        accent: '#FFD700', // Warning/Risk Yellow
        surface: '#FDFDFD',
        border: '#EAEEF2',
        tint: '#7E1C25',
        icon: '#7F8C8D', // Softer grey
        tabIconDefault: '#BDC3C7',
        tabIconSelected: '#7E1C25',
    },
    dark: {
        text: '#F8F9FA',
        background: '#121212',
        primary: '#8A232E',
        secondary: '#5DADE2',
        accent: '#F1C40F',
        surface: '#1E1E1E',
        border: '#333333',
        tint: '#8A232E',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#8A232E',
    },
};

export const Fonts = Platform.select({
    ios: {
        sans: 'system-ui',
        serif: 'ui-serif',
        rounded: 'ui-rounded',
        mono: 'ui-monospace',
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
});
