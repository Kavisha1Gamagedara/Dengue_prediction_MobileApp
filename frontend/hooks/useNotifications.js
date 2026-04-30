import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('FCM Token:', token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (token) {
      // Send token to backend
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
          await fetch(`${API_BASE_URL}/register_fcm_token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({ fcm_token: token }),
          });
          console.log('Token registered on backend');
        }
      } catch (e) {
        console.error('Error registering token:', e);
      }
    }

    return token;
  };

  const scheduleDailyAlert = async (hour, minute) => {
    try {
      // First, cancel all existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Calculate seconds from now until the target time
      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      
      // If the time has already passed today, schedule it for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const secondsUntilTarget = Math.max(1, Math.floor((target.getTime() - now.getTime()) / 1000));
      console.log(`Scheduling notification in ${secondsUntilTarget} seconds...`);

      // Schedule the notification using a relative time interval (most compatible)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚨 Dengue Risk Alert",
          body: "Check today's danger areas in the map. Stay safe and take precautions!",
          data: { screen: 'Explore' },
          sound: true,
          vibrationPattern: [0, 250, 250, 250],
        },
        trigger: {
          type: 'timeInterval', // Use the most widely supported trigger type
          seconds: secondsUntilTarget,
          repeats: false, // Set to false to verify the first one works at the right time
        },
      });
      console.log(`Notification scheduled for ${hour}:${minute}`);
      return true;
    } catch (e) {
      console.error('Error scheduling notification:', e);
      return false;
    }
  };

  return { registerForPushNotificationsAsync, scheduleDailyAlert };
};
