import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { FAB, List, Text } from 'react-native-paper';
import { getDB } from '../../../src/services/db';

export default function PeopleList() {
    const db = getDB();
    const [people, setPeople] = useState<any[]>([]);

    useEffect(() => {
        loadPeople();
    }, []);

    const loadPeople = async () => {
        const result = await db.getAllAsync('SELECT * FROM contacts ORDER BY name ASC');
        setPeople(result);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                data={people}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={item.relationship_context}
                        left={props => <List.Icon {...props} icon="account" />}
                        onPress={() => console.log('Open Dossier', item.id)}
                    />
                )}
                ListEmptyComponent={<View style={{ padding: 20 }}><Text>No contacts found. Record a meeting to add them!</Text></View>}
            />
            <FAB
                icon="plus"
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                onPress={() => console.log('Manual Add')}
            />
        </View>
    );
}
