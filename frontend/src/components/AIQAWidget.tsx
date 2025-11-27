import { useState, useRef } from "react";
import { Send, Mic, MicOff, Upload, X, ImagePlus, FileText, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "question" | "answer";
  content: string;
  attachments?: {
    type: "image" | "file" | "audio";
    name: string;
    url?: string;
  }[];
  timestamp: Date;
}

interface AIQAWidgetProps {
  lectureId: string;
  lectureTopic: string;
}

const AIQAWidget = ({ lectureId, lectureTopic }: AIQAWidgetProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [expandedView, setExpandedView] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // Create a File-like object from the blob
        const file = new Blob([audioBlob], { type: "audio/wav" }) as any;
        file.name = `audio-${Date.now()}.wav`;
        file.lastModified = Date.now();
        setAttachments((prev) => [...prev, file]);
        stream.getTracks().forEach((track) => track.stop());
        toast({
          title: "Audio Recorded",
          description: "Voice message added successfully",
        });
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "File size must be less than 10MB",
            variant: "destructive",
          });
          return;
        }
        setAttachments((prev) => [...prev, file]);
      });
    }
    event.currentTarget.value = "";
  };

  // Handle camera capture
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      setAttachments((prev) => [...prev, files[0]]);
      toast({
        title: "Photo Captured",
        description: "Image added successfully",
      });
    }
    event.currentTarget.value = "";
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send question
  const handleSendQuestion = async () => {
    if (!inputText.trim() && attachments.length === 0) {
      toast({
        title: "Empty Question",
        description: "Please enter text or attach a file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const newQuestion: Message = {
      id: `q-${Date.now()}`,
      type: "question",
      content: inputText,
      attachments: attachments.map((file) => ({
        type: (file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("audio/")
          ? "audio"
          : "file") as "image" | "file" | "audio",
        name: file.name,
      })),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newQuestion]);
    setInputText("");
    setAttachments([]);

    // Simulate AI response (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: `a-${Date.now()}`,
        type: "answer",
        content: `This is an AI-generated answer to your question about "${lectureTopic}". In a real implementation, this would be powered by an AI model that understands the lecture content and your question${
          newQuestion.attachments && newQuestion.attachments.length > 0
            ? ` along with the ${newQuestion.attachments.length} attachment(s) you provided`
            : ""
        }.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 shadow-elevated">
      <h3 className="font-semibold text-foreground mb-4">Ask AI Questions</h3>

      {/* Chat Messages Area */}
      {expandedView && messages.length > 0 && (
        <div className="mb-4 max-h-96 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "question" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === "question"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-black/20 px-2 py-1 rounded flex items-center gap-1"
                      >
                        {att.type === "image" && <ImagePlus className="h-3 w-3" />}
                        {att.type === "audio" && <Mic className="h-3 w-3" />}
                        {att.type === "file" && <FileText className="h-3 w-3" />}
                        <span>{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4 p-3 bg-accent/10 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Attachments ({attachments.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-background border border-border rounded px-3 py-2 text-xs"
              >
                {file.type.startsWith("image/") && (
                  <ImagePlus className="h-4 w-4 text-primary" />
                )}
                {file.type.startsWith("audio/") && (
                  <Mic className="h-4 w-4 text-accent" />
                )}
                {!file.type.startsWith("image/") &&
                  !file.type.startsWith("audio/") && (
                    <FileText className="h-4 w-4 text-warning" />
                  )}
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="ml-auto hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        {/* Text Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about this lecture..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendQuestion();
              }
            }}
            className="flex-1"
            disabled={isRecording || isLoading}
          />
          <Button
            onClick={handleSendQuestion}
            disabled={isRecording || isLoading || (!inputText.trim() && attachments.length === 0)}
            size="sm"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg animate-pulse">
            <div className="h-3 w-3 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-accent">
              Recording: {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Microphone Button */}
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4" />
                <span className="hidden sm:inline">Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Record Audio</span>
              </>
            )}
          </Button>

          {/* Image Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || isLoading}
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Image</span>
          </Button>

          {/* Camera Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isRecording || isLoading}
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Camera</span>
          </Button>

          {/* File Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.onchange = (e) => {
                const event = e as any;
                handleFileSelect(event);
              };
              input.click();
            }}
            disabled={isRecording || isLoading}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Upload File</span>
          </Button>

          {/* Expand Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedView(!expandedView)}
            className="ml-auto"
          >
            {expandedView ? "Collapse" : "View Chat"}
          </Button>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-muted-foreground mt-3">
        💡 Tip: You can combine text with audio, images, and files for better answers
      </p>
    </Card>
  );
};

export default AIQAWidget;
