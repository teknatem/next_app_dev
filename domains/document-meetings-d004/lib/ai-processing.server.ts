import 'server-only';

import {
  type MeetingArtefact,
  type NewMeetingArtefact,
  type AIProcessingRequest,
  ArtefactType,
  ArtefactStatus
} from '../model/meetings.schema';

/**
 * AI Processing Service for meeting content analysis
 * Handles transcript generation and speaker diarisation
 */
export class AIProcessingService {
  private providers = {
    transcript: ['Whisper', 'AssemblyAI', 'OpenAI'],
    diarisation: ['AssemblyAI', 'Deepgram', 'Azure Speech']
  };

  /**
   * Request AI processing for an asset
   */
  async requestProcessing(
    request: AIProcessingRequest
  ): Promise<MeetingArtefact> {
    const { assetId, artefactType, provider, language, options } = request;

    // Validate provider for artefact type
    if (!this.providers[artefactType].includes(provider)) {
      throw new Error(`Provider ${provider} not supported for ${artefactType}`);
    }

    // Create initial artefact record
    const artefactData: NewMeetingArtefact = {
      assetId,
      artefactType,
      provider,
      language,
      version: 1, // Will be incremented if needed
      status: ArtefactStatus.QUEUED,
      payload: null,
      createdAt: new Date(),
      completedAt: null
    };

    // In a real implementation, this would:
    // 1. Save the artefact record to database
    // 2. Queue the processing job
    // 3. Return the created artefact

    // For now, we'll simulate the process
    return this.simulateProcessing(artefactData);
  }

  /**
   * Simulate AI processing (placeholder for real implementation)
   */
  private async simulateProcessing(
    artefactData: NewMeetingArtefact
  ): Promise<MeetingArtefact> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate different payloads based on artefact type
    const payload = this.generateMockPayload(
      artefactData.artefactType,
      artefactData.provider
    );

    return {
      id: crypto.randomUUID(),
      ...artefactData,
      status: ArtefactStatus.DONE,
      payload,
      result: payload, // Use payload as result for now
      summary: null, // No summary for now
      completedAt: new Date(),
      language: artefactData.language || 'en',
      version: artefactData.version || 1,
      createdAt: artefactData.createdAt || new Date()
    };
  }

  /**
   * Generate mock payload for different artefact types
   */
  private generateMockPayload(artefactType: string, provider: string): any {
    if (artefactType === ArtefactType.TRANSCRIPT) {
      return {
        text: 'Это пример транскрипта совещания. Здесь будет текст, полученный от AI сервиса.',
        confidence: 0.95,
        segments: [
          {
            start: 0,
            end: 5,
            text: 'Это пример',
            speaker: 'speaker_1',
            confidence: 0.98
          },
          {
            start: 5,
            end: 10,
            text: 'транскрипта совещания',
            speaker: 'speaker_2',
            confidence: 0.92
          }
        ],
        metadata: {
          provider,
          language: 'ru',
          duration: 120,
          wordCount: 15
        }
      };
    }

    if (artefactType === ArtefactType.DIARISATION) {
      return {
        speakers: [
          {
            id: 'speaker_1',
            name: 'Иван Иванов',
            totalTime: 45,
            segments: [
              { start: 0, end: 15, confidence: 0.95 },
              { start: 30, end: 60, confidence: 0.92 }
            ]
          },
          {
            id: 'speaker_2',
            name: 'Петр Петров',
            totalTime: 75,
            segments: [
              { start: 15, end: 30, confidence: 0.88 },
              { start: 60, end: 120, confidence: 0.9 }
            ]
          }
        ],
        metadata: {
          provider,
          totalDuration: 120,
          speakerCount: 2,
          confidence: 0.91
        }
      };
    }

    return null;
  }

  /**
   * Get supported providers for an artefact type
   */
  getSupportedProviders(artefactType: string): string[] {
    return this.providers[artefactType as keyof typeof this.providers] || [];
  }

  /**
   * Check processing status
   */
  async checkProcessingStatus(artefactId: string): Promise<ArtefactStatus> {
    // In real implementation, this would check the actual processing status
    // For now, return a mock status
    return ArtefactStatus.DONE;
  }

  /**
   * Cancel processing
   */
  async cancelProcessing(artefactId: string): Promise<boolean> {
    // In real implementation, this would cancel the processing job
    // For now, return success
    return true;
  }

  /**
   * Retry failed processing
   */
  async retryProcessing(artefactId: string): Promise<MeetingArtefact> {
    // In real implementation, this would retry the processing
    // For now, simulate success
    const mockArtefact: NewMeetingArtefact = {
      assetId: 'mock-asset-id',
      artefactType: ArtefactType.TRANSCRIPT,
      provider: 'Whisper',
      language: 'en',
      version: 2,
      status: ArtefactStatus.DONE,
      payload: this.generateMockPayload(ArtefactType.TRANSCRIPT, 'Whisper'),
      createdAt: new Date(),
      completedAt: new Date()
    };

    return {
      id: artefactId,
      ...mockArtefact,
      status: ArtefactStatus.DONE,
      language: mockArtefact.language || 'en',
      version: mockArtefact.version || 1,
      createdAt: mockArtefact.createdAt || new Date(),
      completedAt: mockArtefact.completedAt || new Date(),
      payload: mockArtefact.payload || null,
      result: mockArtefact.payload || null, // Use payload as result
      summary: null // No summary for now
    };
  }
}

// Export singleton instance
export const aiProcessingService = new AIProcessingService();
