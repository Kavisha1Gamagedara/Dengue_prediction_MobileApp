import { Platform } from 'react-native';

export const Colors = {
    light: {
        text: '#1A1A1A', // Darker text
        background: '#FFFFFF',
        primary: '#1A1A1A', // Black buttons in light mode
        secondary: '#F5F5F7', // Light grey for secondary buttons
        accent: '#000000',
        surface: '#FFFFFF',
        border: '#E5E5E7', // Apple-style light border
        tint: '#1A1A1A',
        icon: '#86868B',
        tabIconDefault: '#C1C1C6',
        tabIconSelected: '#000000',
    },
    dark: {
        text: '#F5F5F7', // Off-white text
        background: '#000000', // Pure black
        primary: '#FFFFFF', // White buttons in dark mode
        secondary: '#1C1C1E', // Dark grey for secondary buttons
        accent: '#FFFFFF',
        surface: '#121212',
        border: '#333333',
        tint: '#FFFFFF',
        icon: '#86868B',
        tabIconDefault: '#48484A',
        tabIconSelected: '#FFFFFF',
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
