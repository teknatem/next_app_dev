import dotenv from 'dotenv';

// Загружаем .env.local
dotenv.config({ path: '.env.local' });

interface AssemblyAITranscriptResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text?: string;
  error?: string;
  confidence?: number;
}

async function testAssemblyAI() {
  console.log('🔍 Тестирование интеграции с AssemblyAI...');

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    console.error('❌ ASSEMBLYAI_API_KEY не найден в .env.local');
    return;
  }

  console.log('✅ API ключ найден:', apiKey.substring(0, 10) + '...');

  try {
    // Тест с публичным аудио URL (для демонстрации)
    const testAudioUrl =
      'https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3';

    console.log('📡 Начинаем транскрипцию тестового аудио...');

    // Запускаем транскрипцию
    const startResponse = await fetch(
      'https://api.assemblyai.com/v2/transcript',
      {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: testAudioUrl,
          language_code: 'en',
          speaker_labels: true,
          format_text: true,
          punctuate: true,
          filter_profanity: false
        })
      }
    );

    if (!startResponse.ok) {
      throw new Error(
        `Failed to start transcription: ${startResponse.statusText}`
      );
    }

    const startData = await startResponse.json();
    const transcriptId = startData.id;

    console.log('⏳ Ждем завершения транскрипции... ID:', transcriptId);

    // Проверяем статус
    let result: AssemblyAITranscriptResponse | undefined;
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            Authorization: apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get transcription: ${response.statusText}`);
      }

      result = await response.json();

      if (
        result &&
        (result.status === 'completed' || result.status === 'error')
      ) {
        break;
      }

      if (result) {
        console.log(`🔄 Статус: ${result.status}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    if (result && result.status === 'completed') {
      console.log('✅ Транскрипция завершена!');
      console.log('📄 Результат:', {
        status: result.status,
        confidence: result.confidence,
        textLength: result.text?.length || 0
      });

      if (result.text) {
        console.log('📝 Первые 200 символов текста:');
        console.log(result.text.substring(0, 200) + '...');
      }
    } else if (result) {
      console.error(
        '❌ Транскрипция не завершена:',
        result.status,
        result.error
      );
    } else {
      console.error('❌ Транскрипция не завершена: таймаут');
    }
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);

    if (error instanceof Error) {
      if (error.message.includes('Authorization')) {
        console.log('💡 Проверьте правильность API ключа AssemblyAI');
      } else if (error.message.includes('fetch')) {
        console.log('💡 Проверьте подключение к интернету');
      }
    }
  }
}

testAssemblyAI();
