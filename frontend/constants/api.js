// Local testing URL (points to your machine's local IP where Flask is running)
const localUrl = 'http://192.168.1.5:5000';
// Production URL (Make sure to deploy your backend to Render before switching back!)
const productionUrl = 'https://dengue-backend-l994.onrender.com';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || productionUrl;
export const API_BASE_URL = rawBaseUrl.trim().replace(/\/+$/, '');
export const BUILD_TIME = '6:35 AM';
