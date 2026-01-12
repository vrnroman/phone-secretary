module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-paper|@google/generative-ai|expo-router|expo-modules-core)',
    ],
    moduleNameMapper: {
        // Handle module aliases
        '^@/(.*)$': '<rootDir>/src/$1',
        // Fix for Expo SDK 54 "You are trying to import a file outside of the scope of the test code"
        'expo/src/winter/runtime.native.ts': '<rootDir>/tests/__mocks__/empty.js',
        'expo/src/winter/installGlobal.ts': '<rootDir>/tests/__mocks__/empty.js',
    },
};
