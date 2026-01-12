import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const registerForPushNotificationsAsync = async () => {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    // token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
    return true;
};

export const scheduleTaskReminder = async (taskTitle: string, hoursFromNow: number) => {
    // Convert hours to seconds
    const seconds = Math.floor(hoursFromNow * 60 * 60);

    // Minimum 10 seconds for testing if hoursFromNow is tiny
    const triggerSeconds = Math.max(seconds, 5);

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Action Item Reminder",
            body: taskTitle,
            data: { data: 'goes here' },
        },
        trigger: { seconds: triggerSeconds, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL },
    });

    return id;
};

export const cancelNotification = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
}
