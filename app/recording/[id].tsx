import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';
import { processAudio } from '../../src/services/ai/gemini';
import { getDB } from '../../src/services/db';
import { useSettingsStore } from '../../src/store/settingsStore';

export default function ReviewRecordingScreen() {
    const { id } = useLocalSearchParams();
    const db = getDB();
    const [log, setLog] = useState<any>(null);
    const [sound, setSound] = useState<Audio.Sound>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    const ownerName = useSettingsStore(s => s.ownerName);

    useEffect(() => {
        loadLog();
        return () => {
            sound?.unloadAsync();
        };
    }, [id]);

    const loadLog = async () => {
        const result = await db.getFirstAsync('SELECT * FROM interaction_logs WHERE id = ?', [String(id)]);
        setLog(result);
        const row = result as any;
        // If we have raw_text (transcript), parse it if it looks like JSON
        if (row?.raw_text && row.raw_text.startsWith('{')) {
            try {
                setAnalysis(JSON.parse(row.raw_text));
            } catch (e) { }
        }
    };

    const playSound = async () => {
        if (!log?.file_path) return;

        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: log.file_path }
            );
            setSound(newSound);
            await newSound.playAsync();
            setIsPlaying(true);
            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.didJustFinish) setIsPlaying(false);
            });
        }
    };

    const handleProcess = async () => {
        if (!log?.file_path) return;
        setProcessing(true);
        try {
            console.log("Reading file:", log.file_path);
            const base64 = await FileSystem.readAsStringAsync(log.file_path, { encoding: 'base64' });

            console.log("Sending to Gemini...");
            const result = await processAudio(base64, ownerName);

            console.log("Gemini Response:", result.text);

            // Save to DB
            // We store the full JSON in `raw_text` for now.
            // In a real app we would parse `result.data` and insert into `action_items` and `contacts` tables.
            await db.runAsync(
                'UPDATE interaction_logs SET raw_text = ?, summary = ? WHERE id = ?',
                [result.text, 'Processed', String(id)]
            );

            if (result.data) {
                setAnalysis(result.data);
                // TODO: Here we would iterate result.data.action_items and insert into DB
            }

        } catch (e) {
            console.error(e);
            alert('Failed to process recording.');
        } finally {
            setProcessing(false);
            loadLog();
        }
    };

    if (!log) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Recording" subtitle={new Date(log.created_at).toLocaleString()} />
                <Card.Content>
                    <Button
                        icon={isPlaying ? "pause" : "play"}
                        mode="outlined"
                        onPress={playSound}
                    >
                        {isPlaying ? "Playing..." : "Play Audio"}
                    </Button>
                </Card.Content>
            </Card>

            {!analysis && !processing && (
                <Button mode="contained" onPress={handleProcess} style={styles.processBtn}>
                    Analyze with AI
                </Button>
            )}

            {processing && <ActivityIndicator animating={true} size="large" style={{ margin: 20 }} />}

            {analysis && (
                <View style={{ gap: 10 }}>
                    <Text variant="titleMedium" style={styles.header}>Transcript</Text>
                    <Card style={styles.resultCard}>
                        <Card.Content>
                            <Text>{analysis.transcript || "No transcript available"}</Text>
                        </Card.Content>
                    </Card>

                    <Text variant="titleMedium" style={styles.header}>Action Items</Text>
                    {analysis.action_items?.map((item: any, i: number) => (
                        <Card key={i} style={styles.taskCard}>
                            <Card.Content>
                                <Text variant="titleSmall">{item.task}</Text>
                                <Text variant="bodySmall">Owner: {item.assignee}</Text>
                                <Text variant="bodySmall" style={{ color: 'red' }}>{item.urgency === 'high' ? 'URGENT' : ''}</Text>
                            </Card.Content>
                        </Card>
                    ))}

                    <Text variant="titleMedium" style={styles.header}>Dossier Updates</Text>
                    {analysis.dossier_updates?.map((update: any, i: number) => (
                        <Card key={i} style={styles.infoCard}>
                            <Card.Title title={update.person} />
                            <Card.Content>
                                {update.updates.map((u: string, j: number) => <Text key={j}>• {u}</Text>)}
                            </Card.Content>
                        </Card>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 50,
    },
    card: {
        marginBottom: 20,
    },
    processBtn: {
        marginVertical: 20,
        padding: 5
    },
    header: {
        marginTop: 15,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#333'
    },
    resultCard: {
        backgroundColor: '#fff',
        marginBottom: 5
    },
    taskCard: {
        backgroundColor: '#fff0f0',
        marginBottom: 5
    },
    infoCard: {
        backgroundColor: '#f0f8ff',
        marginBottom: 5
    }
});
