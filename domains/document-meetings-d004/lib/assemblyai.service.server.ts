import 'server-only';

export interface AssemblyAITranscriptResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text?: string;
  error?: string;
  confidence?: number;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  paragraphs?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    words: Array<{
      text: string;
      start: number;
      end: number;
      confidence: number;
    }>;
  }>;
}

export interface AssemblyAIUploadResponse {
  upload_url: string;
}

export class AssemblyAIService {
  private apiKey: string;
  private baseUrl = 'https://api.assemblyai.com/v2';

  constructor() {
    this.apiKey = process.env.ASSEMBLYAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ASSEMBLYAI_API_KEY is not set in environment variables');
    }
  }

  /**
   * Upload audio file to AssemblyAI
   */
  async uploadFile(audioBuffer: Buffer): Promise<string> {
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: audioBuffer
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data: AssemblyAIUploadResponse = await response.json();
    return data.upload_url;
  }

  /**
   * Start transcription process
   */
  async startTranscription(
    audioUrl: string,
    options: {
      language?: string;
      speaker_labels?: boolean;
      format_text?: boolean;
      punctuate?: boolean;
      filter_profanity?: boolean;
    } = {}
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/transcript`, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: options.language || 'ru',
        speaker_labels: options.speaker_labels || false,
        format_text: options.format_text !== false,
        punctuate: options.punctuate !== false,
        filter_profanity: options.filter_profanity || false
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to start transcription: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  }

  /**
   * Get transcription status and result
   */
  async getTranscription(
    transcriptId: string
  ): Promise<AssemblyAITranscriptResponse> {
    const response = await fetch(`${this.baseUrl}/transcript/${transcriptId}`, {
      headers: {
        Authorization: this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get transcription: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Poll for transcription completion
   */
  async waitForTranscription(
    transcriptId: string,
    maxWaitTime = 300000
  ): Promise<AssemblyAITranscriptResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getTranscription(transcriptId);

      if (result.status === 'completed' || result.status === 'error') {
        return result;
      }

      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error('Transcription timeout');
  }

  /**
   * Get audio file from URL and transcribe it
   */
  async transcribeFromUrl(
    audioUrl: string,
    options: {
      language?: string;
      speaker_labels?: boolean;
      format_text?: boolean;
      punctuate?: boolean;
      filter_profanity?: boolean;
    } = {}
  ): Promise<AssemblyAITranscriptResponse> {
    // Start transcription directly with URL
    const transcriptId = await this.startTranscription(audioUrl, options);

    // Wait for completion
    return await this.waitForTranscription(transcriptId);
  }

  /**
   * Get audio file from storage URL and transcribe it
   */
  async transcribeFromStorage(
    storageUrl: string,
    options: {
      language?: string;
      speaker_labels?: boolean;
    } = {}
  ): Promise<AssemblyAITranscriptResponse> {
    try {
      console.log('Starting transcription for URL:', storageUrl);

      // Fetch audio file from storage with proper headers
      const audioResponse = await fetch(storageUrl, {
        headers: {
          'User-Agent': 'Next.js-App/1.0',
          Accept: 'audio/*'
        }
      });

      if (!audioResponse.ok) {
        console.error(
          'Failed to fetch audio file:',
          audioResponse.status,
          audioResponse.statusText
        );
        throw new Error(
          `Failed to fetch audio file: ${audioResponse.statusText}`
        );
      }

      console.log(
        'Audio file fetched, content type:',
        audioResponse.headers.get('content-type')
      );

      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
      console.log('Audio buffer size:', audioBuffer.length);

      // Upload to AssemblyAI
      console.log('Uploading to AssemblyAI...');
      const uploadUrl = await this.uploadFile(audioBuffer);
      console.log('Upload URL received:', uploadUrl);

      // Start transcription
      console.log('Starting transcription...');
      const transcriptId = await this.startTranscription(uploadUrl, options);
      console.log('Transcription started, ID:', transcriptId);

      // Wait for completion
      const result = await this.waitForTranscription(transcriptId);
      console.log('Transcription completed with status:', result.status);

      return result;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error(
        `Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get audio file from storage using S3 key and transcribe it
   */
  async transcribeFromS3(
    s3Key: string,
    options: {
      language?: string;
      speaker_labels?: boolean;
    } = {}
  ): Promise<AssemblyAITranscriptResponse> {
    try {
      console.log('Starting transcription for S3 key:', s3Key);

      // Get presigned URL for reading the file
      const { getPresignedReadUrl } = await import(
        '@/domains/catalog-files-d002/index.server'
      );
      const presignedUrl = await getPresignedReadUrl(s3Key);
      console.log('Generated presigned URL for reading');

      // Fetch audio file from S3 using presigned URL
      const audioResponse = await fetch(presignedUrl, {
        headers: {
          'User-Agent': 'Next.js-App/1.0',
          Accept: 'audio/*'
        }
      });

      if (!audioResponse.ok) {
        console.error(
          'Failed to fetch audio file from S3:',
          audioResponse.status,
          audioResponse.statusText
        );
        throw new Error(
          `Failed to fetch audio file from S3: ${audioResponse.statusText}`
        );
      }

      console.log(
        'Audio file fetched from S3, content type:',
        audioResponse.headers.get('content-type')
      );

      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
      console.log('Audio buffer size:', audioBuffer.length);

      // Upload to AssemblyAI
      console.log('Uploading to AssemblyAI...');
      const uploadUrl = await this.uploadFile(audioBuffer);
      console.log('Upload URL received:', uploadUrl);

      // Start transcription
      console.log('Starting transcription...');
      const transcriptId = await this.startTranscription(uploadUrl, options);
      console.log('Transcription started, ID:', transcriptId);

      // Wait for completion
      const result = await this.waitForTranscription(transcriptId);
      console.log('Transcription completed with status:', result.status);

      return result;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error(
        `Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Export singleton instance
export const assemblyAIService = new AssemblyAIService();
