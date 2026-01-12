import { render } from '@testing-library/react-native';
import React from 'react';
import RootLayout from '../app/_layout';

// Mock Expo modules that might crash in Node environment
jest.mock('expo-router', () => ({
    Stack: {
        Screen: () => null,
    },
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    useLocalSearchParams: () => ({ id: '1' }),
}));

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: () => ({
        execAsync: jest.fn(),
        runAsync: jest.fn(),
        getFirstAsync: jest.fn(),
        getAllAsync: jest.fn(),
    })
}));

jest.mock('expo-av', () => ({
    Audio: {
        usePermissions: () => [{ granted: true }, jest.fn()],
        Recording: {
            createAsync: jest.fn(),
        },
        Sound: {
            createAsync: jest.fn(),
        },
        setAudioModeAsync: jest.fn(),
    }
}));

jest.mock('expo-font', () => ({
    useFonts: () => [true],
}));

jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn(),
    getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    requestPermissionsAsync: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// We need to mock Font loading because it's async and PaperProvider waits for it
jest.mock('expo-font');

describe('App Startup', () => {
    it('renders the root layout without crashing', () => {
        const { toJSON } = render(<RootLayout />);
        expect(toJSON()).toBeDefined();
    });
});
