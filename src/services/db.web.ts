let mockState = {
    contacts: [],
    problems: [],
    interaction_logs: [],
    action_items: []
};

const mockDb = {
    execAsync: async (query: string) => {
        console.log('[Web DB] execAsync:', query);
    },
    runAsync: async (query: string, params: any[]) => {
        console.log('[Web DB] runAsync:', query, params);
        // Simple mock for inserting interaction logs
        if (query.includes('INSERT INTO interaction_logs')) {
            const id = mockState.interaction_logs.length + 1;
            // @ts-ignore
            mockState.interaction_logs.push({ id, ...params });
            return { lastInsertRowId: id };
        }
        return { lastInsertRowId: 0, changes: 0 };
    },
    getFirstAsync: async (query: string, params: any[]) => {
        console.log('[Web DB] getFirstAsync:', query, params);
        if (query.includes('FROM interaction_logs WHERE id')) {
            // @ts-ignore
            return mockState.interaction_logs.find(l => String(l.id) === String(params[0]));
        }
        return null;
    },
    getAllAsync: async (query: string) => {
        console.log('[Web DB] getAllAsync:', query);
        if (query.includes('FROM contacts')) return mockState.contacts;
        if (query.includes('FROM problems')) return mockState.problems;
        return [];
    }
};

export const initDatabase = async () => {
    console.log('[Web DB] Database initialized (InMemory Mock)');
};

export const getDB = () => mockDb;

export const resetDatabase = async () => {
    mockState = {
        contacts: [],
        problems: [],
        interaction_logs: [],
        action_items: []
    };
    console.log('[Web DB] Database reset');
};
