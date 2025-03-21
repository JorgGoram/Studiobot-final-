import { useState, useRef } from 'react';
import { Zap, Upload, File, X, Play, Pause } from 'lucide-react';
import { PasswordProtection } from './PasswordProtection';
import { extractTextFromDocument } from '../../lib/document-processor';
import toast from 'react-hot-toast';
import { TrainingFile } from '../../types/OptionalPreference';
import { updateOptionalPreferences } from '../../lib/supabase';
import {
  generatePrompt,
  generatePromptDoc,
  generatePromptFAQ,
  generateTattooShopInfoPrompt,
} from '../../utils';
import { updateAssistant } from '../../lib/synthflow';

export function VoiceTrainingSettings() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [files, setFiles] = useState<TrainingFile[]>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    setIsProcessing(true);

    try {
      for (const file of selectedFiles) {
        const newFile: TrainingFile = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: 'uploading',
        };

        setFiles((prev) => [...prev, newFile]);

        // Process the file and extract text
        const extractedText = await extractTextFromDocument(
          file,
          (progress) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id ? { ...f, progress: progress.progress } : f
              )
            );
          }
        );

        // Update file with extracted content
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id
              ? {
                  ...f,
                  content: extractedText,
                  status: 'complete',
                  progress: 100,
                }
              : f
          )
        );

        toast.success(`Successfully processed ${file.name}`, {
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(144, 74, 242, 0.2)',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        });
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process some files', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(144, 74, 242, 0.2)',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleFileRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    if (isPlaying === id) {
      setIsPlaying(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const togglePlayback = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(id);
      // In a real implementation, this would play the actual audio file
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Process all completed files
      const processedFiles = files.filter((file) => file.status === 'complete');

      if (processedFiles.length === 0) {
        toast.error('No processed files to save', {
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(144, 74, 242, 0.2)',
          },
        });
        return;
      }

      // Here you would typically send the processed content to your backend
      const {
        training_data,
        scraping_data,
        specific_instructions,
        faq,
        hourly_rate,
        operating_hours,
      } = await updateOptionalPreferences({ training_data: processedFiles });

      let prompt = '';
      prompt += generatePrompt(
        operating_hours,
        String(hourly_rate),
        specific_instructions
      );
      if (scraping_data) {
        prompt += generateTattooShopInfoPrompt(scraping_data);
      }
      if (faq) {
        prompt += generatePromptFAQ(faq);
      }
      if (training_data) {
        training_data.forEach((e) => {
          prompt += `\n${generatePromptDoc(e)}`;
        });
      }
      await updateAssistant({ agent: { prompt } });
      toast.success('Training materials saved successfully', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(144, 74, 242, 0.2)',
        },
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(144, 74, 242, 0.2)',
        },
      });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/80">
            <PasswordProtection
              title="Agent Training"
              description="Train your AI assistant with custom voice samples and behavior patterns to better match your studio's style and personality."
              onUnlock={() => setIsUnlocked(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/80">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-center">
            <Zap className="w-5 h-5 mr-2 text-[#904AF2]" />
            Agent Training
          </h2>

          <div className="space-y-6">
            {/* Training Content */}
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4 border border-zinc-800/50">
                <h3 className="font-medium mb-2">Upload Training Materials</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Upload voice recordings, scripts, or other training materials
                  to help your AI assistant learn. Supported formats: MP3, WAV,
                  PDF, TXT (max 50MB per file)
                </p>

                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center hover:border-[#904AF2]/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".mp3,.wav,.pdf,.txt"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Upload className="w-8 h-8 text-[#904AF2] mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">
                    Drag and drop files here or{' '}
                    <span className="text-[#904AF2]">browse</span>
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-zinc-800/50"
                      >
                        <div className="flex items-center space-x-3">
                          <File className="w-5 h-5 text-[#904AF2]" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-zinc-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {file.type.startsWith('audio/') && (
                            <button
                              onClick={() => togglePlayback(file.id)}
                              className="p-1.5 rounded-lg hover:bg-[#904AF2]/10 text-[#904AF2]"
                            >
                              {isPlaying === file.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {file.status === 'uploading' ? (
                            <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#904AF2] transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleFileRemove(file.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSaveChanges}
              disabled={isProcessing || files.length === 0}
              className="w-full py-2 bg-[#904AF2] text-white rounded-lg hover:bg-[#904AF2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

          {/* Hidden audio element for playback */}
          <audio ref={audioRef} />
        </div>
      </div>
    </div>
  );
}
