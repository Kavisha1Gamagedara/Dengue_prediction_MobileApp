import { Platform } from 'react-native';

export const Colors = {
    light: {
        text: '#2D3436', // 30%
        background: '#FFFFFF', // 60%
        primary: '#FFB347', // 10% (Buttons/Accent)
        secondary: '#7E1C25', // Deep Red (Legacy Primary)
        accent: '#FFB347',
        surface: '#FDFDFD',
        border: '#EAEEF2',
        tint: '#FFB347',
        icon: '#7F8C8D',
        tabIconDefault: '#BDC3C7',
        tabIconSelected: '#FFB347',
    },
    dark: {
        text: '#F8F9FA', // 30%
        background: '#121212', // 60%
        primary: '#FFB347', // 10% (Buttons/Accent)
        secondary: '#8A232E',
        accent: '#FFB347',
        surface: '#1E1E1E',
        border: '#333333',
        tint: '#FFB347',
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#FFB347',
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
