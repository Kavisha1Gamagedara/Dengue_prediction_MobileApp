import { Platform } from 'react-native';

// Use your computer's local IP address if testing on a physical device.
// For Android Emulator, 10.0.2.2 usually maps to localhost.
// For iOS Simulator, localhost or 127.0.0.1 works.
// Use your computer's local IP address (shown in backend logs) to ensure connectivity
const DEV_API_URL = 'http://192.168.1.4:5000';

export const API_BASE_URL = DEV_API_URL;
