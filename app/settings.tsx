import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useSettingsStore } from '../src/store/settingsStore';

export default function SettingsScreen() {
    const { apiKey, setApiKey, ownerName, setOwnerName } = useSettingsStore();
    const [key, setKey] = useState(apiKey || '');
    const [name, setName] = useState(ownerName || 'Me');
    const router = useRouter();

    const handleSave = () => {
        setApiKey(key);
        setOwnerName(name);
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>App Settings</Text>

            <TextInput
                label="Gemini API Key"
                value={key}
                onChangeText={setKey}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />
            <Text variant="bodySmall" style={styles.helper}>
                Get your key from Google AI Studio.
            </Text>

            <TextInput
                label="Owner Name (You)"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
            />
            <Text variant="bodySmall" style={styles.helper}>
                Used to identify you in transcripts.
            </Text>

            <Button mode="contained" onPress={handleSave} style={styles.button}>
                Save Settings
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 5,
    },
    helper: {
        marginBottom: 20,
        color: '#666',
    },
    button: {
        marginTop: 10,
    }
});
