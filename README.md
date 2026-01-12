# phone-secretary

## Android application (React Native)

### Goal:
 - Provide phone owner with reminders, context, information about people and initiatives, problems.
 - Act as an intelligent "Second Brain" for meetings and networking.

### Data Sources:
 - **Audio Recordings**: Meetings, "catch-up" sessions, voice notes.
 - **Photos**: Photos of emails, Teams chats, whiteboard notes.
 - *Future Integration*: Direct access to email/Teams APIs (not in V1).

### Core Features:
1.  **Smart Recording**:
    - Record audio immediately.
    - **Diarization**: Distinguish between "Owner" and others.
    - Owner can "Onboard" (record voice sample) to help identification.
    - Manual correction of speaker identities after recording.
2.  **Vision Capture**:
    - Take photos of text-heavy content (emails, chats).
    - Parse content using AI to update dossiers/tasks.
3.  **Manual Input**:
    - Add thoughts/tasks to specific dossiers manually.
4.  **Intelligent Processing (Gemini powered)**:
    - Summarize problems/initiatives.
    - Maintain dynamic "Dossiers" on people (Family, Hobbies, Plans, Opinions).
    - Extract and classify Action Items.
5.  **Notifications**:
    - Automatic scheduling of reminders for Action Items.
    - Local push notifications to ensure timely follow-ups.
6.  **Database & Retrieval**:
    - **People Dossier**: Structured views of contacts.
    - **Problem/Initiative Dossier**: Context and history of specific topics.
6.  **Action Item Management**:
    - "On Me": Personal tasks.
    - "On Others": Tasks to chase.
    - **Auto-Notifications**: AI classifies task complexity (easy = 2h reminder, Big = 1d reminder).

### Technical Architecture

#### Stack
- **Framework**: React Native (Cross-platform capable, initially Android focused).
- **AI Provider**: Google Gemini API (Multi-modal: Audio, Vision, Text).
  - *Architecture Note*: Abstracted behind an `AIService` interface to allow future swapping of providers.
- **Database**: Local SQLite (via `expo-sqlite` or similar). Local-first architecture specifically designed to support Cloud Sync in V2.
- **Storage**: App-private storage for audio/images.

#### Data Privacy & Security
- **Auth**: Local API Key storage (V1).
- **Processing**: Cloud-based processing via Gemini (Audio/Images sent to cloud).
- **Persistence**: Data stored locally on the device (SQLite).

## Future Roadmap (V2+)
- Cloud Sync for Database.
- Direct integrations with Microsoft Graph / Google Workspace.
- Enhanced On-device AI for offline basic capabilities.
