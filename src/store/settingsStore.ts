import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
    apiKey: string | null;
    ownerName: string;
    setApiKey: (key: string) => void;
    setOwnerName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            apiKey: null,
            ownerName: 'Me',
            setApiKey: (key) => set({ apiKey: key }),
            setOwnerName: (name) => set({ ownerName: name }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
