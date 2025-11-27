import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Save } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import testsData from "@/data/tests.json";

interface Question {
  id: string;
  marks: number;
  type: string;
  text: string;
  expected_keywords: string[];
  sample_answer: string;
}

interface Test {
  id: string;
  title: string;
  total_marks: number;
  duration_minutes: number;
  questions: Question[];
}

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find test by id
  const test = testsData.tests.find((t) => t.id === id) as Test | undefined;
  
  const [timeLeft, setTimeLeft] = useState(test ? test.duration_minutes * 60 : 0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(`test_${id}_draft`);
    if (draft) {
      setAnswers(JSON.parse(draft));
    }
  }, [id]);

  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`test_${id}_draft`, JSON.stringify(answers));
    }
  }, [answers, id]);

  useEffect(() => {
    if (submitted || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, test]);

  if (!test) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Test not found</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // Simple AI scoring based on keywords
  const calculateAIScore = () => {
    let totalScore = 0;
    
    test.questions.forEach(q => {
      const answer = (answers[q.id] || '').toLowerCase();
      let questionScore = 0;
      
      q.expected_keywords.forEach(keyword => {
        if (answer.includes(keyword.toLowerCase())) {
          questionScore += q.marks / q.expected_keywords.length;
        }
      });
      
      totalScore += Math.min(questionScore, q.marks);
    });
    
    return Math.round(totalScore);
  };

  const handleSubmit = () => {
    const score = calculateAIScore();
    setAiScore(score);
    setSubmitted(true);
    
    // Save result
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    results.push({
      test_id: id,
      answers,
      score,
      submitted_at: new Date().toISOString()
    });
    localStorage.setItem('testResults', JSON.stringify(results));
    localStorage.removeItem(`test_${id}_draft`);
    
    toast({
      title: "Test Submitted",
      description: "Your answers have been saved successfully",
    });
  };

  const isTimeWarning = timeLeft < 300; // Less than 5 minutes

  if (submitted) {
    const percentage = Math.round((aiScore! / test.total_marks) * 100);
    const passed = percentage >= 60;
    
    return (
      <Sidebar>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-2xl p-8 text-center shadow-elevated">
            <h1 className="text-3xl font-bold text-foreground mb-4">Test Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your answers have been evaluated by AI
            </p>

            <div className={`rounded-xl p-6 mb-6 ${passed ? 'bg-accent/10' : 'bg-warning/10'}`}>
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className="text-4xl font-bold text-primary">{aiScore}/{test.total_marks}</p>
              <p className="text-lg text-muted-foreground mt-2">{percentage}%</p>
              <p className="text-sm mt-2">
                {passed ? '🎉 Great job! You passed!' : '📝 Keep practicing!'}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {navigator.onLine ? '✓ Results synced to server' : '📱 Saved locally (will sync when online)'}
            </p>

            <Button className="w-full" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Test Header */}
          <Card className={`p-6 mb-6 shadow-elevated ${isTimeWarning ? 'border-destructive' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{test.title}</h1>
                <p className="text-muted-foreground">Total Marks: {test.total_marks}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                  isTimeWarning 
                    ? 'bg-destructive/10 border-destructive animate-pulse' 
                    : 'bg-warning/10 border-warning'
                }`}>
                  <Clock className={`h-5 w-5 ${isTimeWarning ? 'text-destructive' : 'text-warning'}`} />
                  <span className={`font-mono font-bold ${isTimeWarning ? 'text-destructive' : 'text-warning'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <Save className="h-5 w-5 text-accent" />
              </div>
            </div>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {test.questions.map((q, index) => (
              <Card key={q.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Question {index + 1}
                  </h3>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {q.marks} marks
                  </span>
                </div>

                <p className="text-foreground mb-4">{q.text}</p>

                <Textarea
                  placeholder="Write your answer here..."
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="min-h-[150px] resize-y"
                />
                
                <p className="text-xs text-muted-foreground mt-2">
                  {q.type === 'short_answer' ? '📝 Short answer (2-3 sentences)' : '📄 Long answer (paragraph)'}
                </p>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <Card className="p-6 mt-6 sticky bottom-4 shadow-elevated">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">✓ Auto-saving answers</p>
              <Button onClick={handleSubmit} size="lg">
                Submit Test
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
    </Sidebar>
  );
};

export default TestPage;
