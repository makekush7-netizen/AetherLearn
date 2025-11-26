import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, StickyNote } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Classroom from "@/components/Classroom";
import lecturesData from "@/data/lectures.json";
import quizzesData from "@/data/quizzes.json";

interface Caption {
  time_start: number;
  time_end: number;
  text: string;
}

interface Lecture {
  id: string;
  topic: string;
  grade: string;
  subject: string;
  speech_text: string;
  audio_url: string;
  duration_seconds: number;
  captions: Caption[];
  notes: string;
  lecturer_animation: string;
}

const LecturePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentCaption, setCurrentCaption] = useState("");
  const [classroomLoaded, setClassroomLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Find lecture by id
  const lecture = lecturesData.lectures.find((l) => l.id === id) as Lecture | undefined;
  const quiz = quizzesData.quizzes.find((q) => q.lecture_id === id);

  // Update caption based on current time
  useEffect(() => {
    if (!lecture) return;
    
    const caption = lecture.captions.find(
      (c) => currentTime >= c.time_start && currentTime < c.time_end
    );
    setCurrentCaption(caption?.text || "");
  }, [currentTime, lecture]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!lecture) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Lecture not found</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const lectureMinutes = Math.ceil(lecture.duration_seconds / 60);
  const progressPercent = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src={lecture.audio_url} preload="metadata" />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Lecture Title */}
        <h1 className="text-3xl font-bold text-foreground mb-6">
          {lecture.topic}
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Lecture Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* 3D Classroom Container */}
            <Card className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden shadow-elevated">
              <div className="w-full h-full">
                <Classroom 
                  isPlaying={isPlaying} 
                  onLoaded={() => setClassroomLoaded(true)}
                />
              </div>

              {/* Loading overlay */}
              {!classroomLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <p className="text-muted-foreground">Loading 3D Classroom...</p>
                </div>
              )}

              {/* Caption Overlay */}
              {currentCaption && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border">
                  <p className="text-foreground text-center">
                    {currentCaption}
                  </p>
                </div>
              )}
            </Card>

            {/* Audio Controls */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="rounded-full w-14 h-14"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration || lecture.duration_seconds}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || lecture.duration_seconds)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowNotes(!showNotes)}
                className="flex-1"
              >
                <StickyNote className="h-4 w-4 mr-2" />
                {showNotes ? "Hide" : "Show"} Notes
              </Button>
              {quiz && (
                <Button 
                  className="flex-1"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  Take Quiz
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Lecture Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium text-foreground">{lecture.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Grade</p>
                  <p className="font-medium text-foreground">{lecture.grade}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{lectureMinutes} minutes</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Progress</p>
                  <p className="font-medium text-foreground">{progressPercent}%</p>
                </div>
              </div>
            </Card>

            {showNotes && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Lecture Notes</h3>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {lecture.notes}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturePage;
