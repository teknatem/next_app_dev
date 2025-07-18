/**
 * @fileoverview Centralized registry of all business domains in the project.
 * This file serves as a single source of truth for domain metadata,
 * facilitating understanding, navigation, and LLM-assisted development.
 *
 * @llm_purpose Provides a high-level overview of available domains, their responsibilities,
 *              public APIs, and inter-domain dependencies. Use this to quickly grasp
 *              the project's architecture and identify relevant domains for tasks.
 *              DO NOT directly modify this file; it is generated/maintained by the `domain-cli` tool.
 */

interface DomainEntry {
  /** Unique technical identifier for the domain (e.g., 'd001'). */
  id: string;
  /** Human-readable, snake-case name of the domain (e.g., 'llm-chat'). */
  name: string;
  /** A concise summary of the domain's primary purpose (max 120 chars). */
  summary: string;
  /** Detailed description of the domain's functionality, scope, and key responsibilities. */
  description: string;
  /** Relative path to the domain's root folder from the project root. */
  path: string;
  /** Names of public APIs (functions, components, classes) exposed by this domain for client-side consumption (from index.ts). */
  exposedClientApis: string[];
  /** Names of public APIs (repositories, server actions) exposed by this domain for server-side consumption (from index.server.ts). */
  exposedServerApis: string[];
  /** List of domain IDs (e.g., 'd002') that this domain directly depends on. */
  dependencies: string[];
  /** Names of events that this domain may publish to the shared event bus (shared/events/). */
  eventsPublished: string[];
  /** Names of events that this domain may consume from the shared event bus (shared/events/). */
  eventsConsumed: string[];
}

export const domainRegistry: DomainEntry[] = [
  {
    id: 'd002',
    name: 'catalog-files',
    summary: 'Управление файлами, их хранением и метаданными.',
    description:
      'Предоставляет функции загрузки, хранения, просмотра, редактирования метаданных и управления файлами. Включает работу с S3, UI-виджеты и HTTP API.',
    path: 'domains/catalog-files-d002',
    exposedClientApis: [
      'FileList',
      'FileUploader',
      'FileDetails',
      'FilePicker',
      'formatDate',
      'formatDateTime'
    ],
    exposedServerApis: [
      'fileRepository',
      'getPresignedUploadUrl',
      'getPresignedReadUrl'
    ],
    dependencies: [],
    eventsPublished: ['FileUploaded', 'FileMetadataUpdated', 'FileDeleted'],
    eventsConsumed: []
  },
  {
    id: 'd003',
    name: 'catalog-employees',
    summary: 'Управление данными о сотрудниках.',
    description:
      'Полный CRUD для сущности "Сотрудник": хранение, поиск, редактирование, деактивация. Включает UI-компоненты и серверные действия.',
    path: 'domains/catalog-employees-d003',
    exposedClientApis: ['EmployeeList', 'EmployeeDetails', 'EmployeePicker'],
    exposedServerApis: [
      'employeeRepositoryServer',
      'createEmployeeAction',
      'updateEmployeeAction',
      'deactivateEmployeeAction',
      'getEmployeesAction',
      'getEmployeeByIdAction',
      'searchEmployeesAction',
      'getDepartmentsAction',
      'getPositionsAction',
      'saveEmployee',
      'deleteEmployee'
    ],
    dependencies: [],
    eventsPublished: ['EmployeeCreated', 'EmployeeUpdated', 'EmployeeDeleted'],
    eventsConsumed: []
  },
  {
    id: 'd004',
    name: 'document-meetings',
    summary: 'Управление встречами и связанными активами.',
    description:
      'Создание, просмотр, редактирование, удаление встреч, управление участниками и файлами, генерация транскрипций и статистики.',
    path: 'domains/document-meetings-d004',
    exposedClientApis: [
      'MeetingList',
      'MeetingDetails',
      'MeetingPicker',
      'TranscriptionEditor'
    ],
    exposedServerApis: [
      'meetingRepositoryServer',
      'getMeetingsAction',
      'searchMeetingsAction',
      'saveMeetingAction',
      'deleteMeetingAction',
      'getMeetingByIdAction',
      'getAssetsByMeetingIdAction',
      'createMeetingAssetAction',
      'deleteMeetingAssetAction',
      'getArtefactsByAssetIdAction',
      'createTranscriptionAction',
      'getArtefactByIdAction',
      'getArtefactsByMeetingIdAction',
      'deleteArtefactAction',
      'getTranscriptionDataAction',
      'saveTranscriptionAction'
    ],
    dependencies: ['d002'],
    eventsPublished: [
      'MeetingCreated',
      'MeetingUpdated',
      'MeetingDeleted',
      'MeetingAssetAdded'
    ],
    eventsConsumed: ['FileUploaded']
  }
];
