import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { useSettingsStore } from '../src/store/settingsStore';

export default function Dashboard() {
    const router = useRouter();
    const apiKey = useSettingsStore((state) => state.apiKey);

    useEffect(() => {
        if (!apiKey) {
            // Prompt user to set API key if missing
            // We can't immediately navigate in useEffect without a small delay or check
            // But showing a banner is better
        }
    }, [apiKey]);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Phone Secretary" />
                <Appbar.Action icon="cog" onPress={() => router.push('/settings')} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                {!apiKey && (
                    <Card style={styles.warningCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: 'white' }}>Setup Required</Text>
                            <Text variant="bodyMedium" style={{ color: 'white' }}>Please add your Gemini API Key in Settings to enable AI features.</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained-tonal" onPress={() => router.push('/settings')}>Go to Settings</Button>
                        </Card.Actions>
                    </Card>
                )}

                <View style={styles.statsContainer}>
                    <Card style={styles.statCard} onPress={() => router.push('/tasks')}>
                        <Card.Content>
                            <Text variant="displaySmall">3</Text>
                            <Text variant="labelLarge">Tasks Due</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.statCard} onPress={() => router.push('/dossier/people')}>
                        <Card.Content>
                            <Text variant="displaySmall">12</Text>
                            <Text variant="labelLarge">People</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>

                <View style={styles.actionGrid}>
                    <Button
                        mode="contained"
                        icon="microphone"
                        style={styles.actionButton}
                        contentStyle={styles.actionButtonContent}
                        labelStyle={{ fontSize: 18 }}
                        onPress={() => router.push('/record')}
                    >
                        Record Meeting
                    </Button>

                    <Button
                        mode="contained"
                        icon="camera"
                        buttonColor="#03dac6"
                        style={styles.actionButton}
                        contentStyle={styles.actionButtonContent}
                        labelStyle={{ fontSize: 18 }}
                        onPress={() => console.log('OPEN CAMERA')}
                    >
                        Capture Text
                    </Button>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Recent Insights</Text>
                <Card style={styles.insightCard}>
                    <Card.Title title="Project Alpha" subtitle="Updated 2h ago" />
                    <Card.Content>
                        <Text numberOfLines={3}>Discussed the delay in timeline. John works on the backend fix. Need to follow up by Friday.</Text>
                    </Card.Content>
                </Card>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    content: {
        padding: 16,
    },
    warningCard: {
        backgroundColor: '#B00020',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '48%',
    },
    sectionTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    actionGrid: {
        flexDirection: 'column',
        gap: 15,
        marginBottom: 30,
    },
    actionButton: {
        borderRadius: 12,
    },
    actionButtonContent: {
        height: 60,
    },
    insightCard: {
        marginBottom: 10,
    }
});
