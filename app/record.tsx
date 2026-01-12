import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAudioRecorder } from '../src/hooks/useAudioRecorder';
import { getDB } from '../src/services/db';

export default function RecordScreen() {
    const { isRecording, duration, startRecording, stopRecording, hasPermission } = useAudioRecorder();
    const router = useRouter();
    const db = getDB();

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleToggle = async () => {
        if (isRecording) {
            const uri = await stopRecording();
            if (uri) {
                // Save to DB
                const result = await db.runAsync(
                    'INSERT INTO interaction_logs (type, file_path, summary) VALUES (?, ?, ?)',
                    ['audio', uri, 'Pending Processing']
                );
                // Navigate to review
                router.replace(`/recording/${result.lastInsertRowId}`);
            }
        } else {
            await startRecording();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                <Text variant="displayLarge" style={styles.timer}>
                    {formatDuration(duration)}
                </Text>
                <Text variant="bodyLarge" style={styles.status}>
                    {isRecording ? 'Recording...' : 'Ready'}
                </Text>
            </View>

            <View style={styles.controls}>
                <IconButton
                    icon={isRecording ? "stop" : "microphone"}
                    mode="contained"
                    containerColor={isRecording ? "#B00020" : "#6200ee"}
                    iconColor="white"
                    size={60}
                    onPress={handleToggle}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    timer: {
        color: 'white',
        fontWeight: 'bold',
    },
    status: {
        color: '#aaa',
        marginTop: 10,
    },
    controls: {
        marginTop: 20,
    }
});
