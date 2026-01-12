// Web-safe no-op implementation to avoid expo-notifications SSR crashes
export const registerForPushNotificationsAsync = async () => {
    console.log('Push notifications not supported on web (mocked)');
    return null;
};

export const scheduleTaskReminder = async (taskTitle: string, hoursFromNow: number) => {
    console.log('Task reminder scheduling not supported on web (mocked)');
    return null;
};

export const cancelNotification = async (id: string) => {
    console.log('Cancel notification not supported on web (mocked)');
}
