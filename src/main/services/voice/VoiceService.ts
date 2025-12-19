import { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../../shared/constants/channels';

// Dynamic import for ESM module
let pipeline: typeof import('@xenova/transformers').pipeline | null = null;

export class VoiceService {
  private transcriber: unknown = null;
  private isInitialized = false;
  private isRecording = false;
  private mainWindow: BrowserWindow | null = null;

  async initialize(mainWindow: BrowserWindow): Promise<void> {
    this.mainWindow = mainWindow;

    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Initializing Whisper model... This may take a moment on first run.');

      // Dynamic import of ESM module
      if (!pipeline) {
        const transformers = await import('@xenova/transformers');
        pipeline = transformers.pipeline;
      }

      // Load the Whisper model for speech-to-text
      // Using the small model for better balance of speed and accuracy
      this.transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-small.en',
        {
          quantized: true, // Use quantized model for faster inference
        }
      );

      this.isInitialized = true;
      console.log('Whisper model loaded successfully!');
    } catch (error) {
      console.error('Failed to initialize Whisper:', error);
      throw error;
    }
  }

  async transcribe(audioData: Float32Array | ArrayBuffer, sampleRate: number = 16000): Promise<string> {
    if (!this.transcriber) {
      throw new Error('Voice service not initialized. Call initialize() first.');
    }

    try {
      // Convert to the format expected by Whisper
      let audioArray: Float32Array;

      if (audioData instanceof ArrayBuffer) {
        audioArray = new Float32Array(audioData);
      } else {
        audioArray = audioData;
      }

      // Resample to 16kHz if needed (Whisper expects 16kHz)
      if (sampleRate !== 16000) {
        audioArray = this.resample(audioArray, sampleRate, 16000);
      }

      // Cast transcriber to callable function
      const transcribe = this.transcriber as (audio: Float32Array, options: Record<string, unknown>) => Promise<unknown>;

      const result = await transcribe(audioArray, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: 'english',
        task: 'transcribe',
        return_timestamps: false,
      });

      // Handle different response formats
      if (typeof result === 'string') {
        return result;
      } else if (result && typeof result === 'object') {
        if ('text' in result) {
          return (result as { text: string }).text;
        }
      }

      return '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  private resample(audioData: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array {
    const ratio = fromSampleRate / toSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1);
      const t = srcIndex - srcIndexFloor;

      // Linear interpolation
      result[i] = audioData[srcIndexFloor] * (1 - t) + audioData[srcIndexCeil] * t;
    }

    return result;
  }

  startRecording(): { success: boolean; message: string } {
    if (!this.isInitialized) {
      return {
        success: false,
        message: 'Voice service not initialized. Please wait for the model to load.'
      };
    }

    this.isRecording = true;
    return {
      success: true,
      message: 'Recording started. Speak now...'
    };
  }

  stopRecording(): { success: boolean; message: string } {
    this.isRecording = false;
    return {
      success: true,
      message: 'Recording stopped.'
    };
  }

  getStatus(): {
    isInitialized: boolean;
    isRecording: boolean;
    modelLoaded: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      isRecording: this.isRecording,
      modelLoaded: this.transcriber !== null,
    };
  }

  sendTranscription(text: string): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.VOICE.TRANSCRIPTION, text);
    }
  }
}

export const voiceService = new VoiceService();
