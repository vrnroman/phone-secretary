import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { initDatabase } from '../src/services/db';
import { registerForPushNotificationsAsync } from '../src/services/notifications';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f6f6f6',
  },
};

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
    registerForPushNotificationsAsync();
  }, []);

  return (
    // <PaperProvider theme={theme}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="record" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="recording/[id]" options={{ presentation: 'card', headerShown: true, title: 'Review Recording' }} />
    </Stack>
    // </PaperProvider>
  );
}
