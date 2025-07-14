# Document Meetings Domain (document-meetings-d004)

## Overview

This domain manages corporate meetings, including both online and offline meetings, with support for file attachments and AI-powered processing of meeting content.

## Domain Structure

```
domains/document-meetings-d004/
├── model/                     # ✅ SHARED - Types, schemas, enums
│   └── meetings.schema.ts     # Zod schemas + TypeScript types
├── data/                      # ⚠️ SERVER-ONLY - Database operations
│   └── meeting.repo.server.ts # Repository with 'server-only' directive
├── api/                       # ✅ CLIENT-ONLY - HTTP API calls
│   └── meeting.api.client.ts  # Client API with 'use client' directive
├── lib/                       # 🔄 MIXED - Utilities and services
│   ├── date-utils.ts          # ✅ SHARED - Date formatting utilities
│   └── ai-processing.server.ts # ⚠️ SERVER-ONLY - AI processing services
├── ui/                        # ✅ CLIENT-ONLY - React components
│   ├── meeting.list.client.tsx    # List widget
│   ├── meeting.details.client.tsx # Details widget
│   └── meeting.picker.client.tsx  # Picker widget
├── index.ts                   # ✅ CLIENT-SAFE - Public API for client
├── index.server.ts            # ⚠️ SERVER-ONLY - Public API for server
└── README.md                  # This documentation
```

## Database Schema

### Main Tables

1. **meetings** - Core meeting information

   - Basic meeting details (title, time, location, organizer)
   - Online/offline meeting support
   - Status tracking (started, ended)

2. **meeting_assets** - File attachments and media

   - Documents, audio, video files
   - S3 storage integration
   - Metadata support

3. **meeting_artefacts** - AI processing results
   - Transcripts and diarisation
   - Multiple versions and providers
   - Processing status tracking

## Key Features

- **Meeting Management**: Create, update, and track meetings
- **File Attachments**: Support for documents, audio, and video files
- **AI Processing**: Automatic transcript generation and speaker diarisation
- **Search & Filter**: Advanced search capabilities
- **Integration**: Links to employee catalog and file management

## Usage

### Client Context (React components)

```typescript
import {
  meetingApiClient,
  MeetingList
} from '@/domains/document-meetings-d004';
```

### Server Context (API routes)

```typescript
import { meetingRepositoryServer } from '@/domains/document-meetings-d004/index.server';
```

## Dependencies

- **Internal**: `catalog-employees-d003` (for organizer references)
- **External**: S3 for file storage, AI services for processing
- **Shared**: Database connection, UI components

## Business Rules

1. Meetings can be online or offline
2. File attachments are stored in S3, not in database
3. AI processing is asynchronous and versioned
4. All timestamps are in UTC
5. Cascade deletion for related records
