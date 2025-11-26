import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import quizzesData from "@/data/quizzes.json";

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  lecture_id: string;
  topic: string;
  passing_score: number;
  total_questions: number;
  questions: Question[];
}

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Find quiz by id
  const quiz = quizzesData.quizzes.find((q) => q.id === id) as Quiz | undefined;

  // If quiz not found
  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Quiz not found</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
  const correctAnswerIndex = currentQ.correct_answer.charCodeAt(0) - 65;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Save score to localStorage
      const quizScores = JSON.parse(localStorage.getItem("quizScores") || "{}");
      const percentage = (score / questions.length) * 100;
      quizScores[quiz.id] = percentage;
      localStorage.setItem("quizScores", JSON.stringify(quizScores));
      
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= quiz.passing_score;
    
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-2xl p-8 text-center shadow-elevated">
            <div className="mb-6">
              {passed ? (
                <CheckCircle className="h-20 w-20 text-accent mx-auto mb-4" />
              ) : (
                <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
              <p className="text-lg text-muted-foreground">
                You scored {score} out of {questions.length}
              </p>
            </div>

            <div className="bg-muted rounded-xl p-6 mb-6">
              <p className="text-5xl font-bold text-primary mb-2">{percentage.toFixed(0)}%</p>
              <p className="text-muted-foreground">
                {passed ? "Great job! You passed!" : `You need ${quiz.passing_score}% to pass. Keep practicing!`}
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-3xl mx-auto">
          {/* Quiz Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">{quiz.topic}</h1>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{progressPercent.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          {/* Question Card */}
          <Card className="p-8 shadow-elevated">
            <h2 className="text-2xl font-bold text-foreground mb-6">{currentQ.text}</h2>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === correctAnswerIndex;
                const showCorrectAnswer = showExplanation && isCorrect;
                const showIncorrectAnswer = showExplanation && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      showCorrectAnswer
                        ? "border-accent bg-accent/10"
                        : showIncorrectAnswer
                        ? "border-destructive bg-destructive/10"
                        : isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary hover:bg-primary/5"
                    } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{option}</span>
                      {showCorrectAnswer && <CheckCircle className="h-5 w-5 text-accent" />}
                      {showIncorrectAnswer && <XCircle className="h-5 w-5 text-destructive" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-muted rounded-xl">
                <p className="font-semibold text-foreground mb-2">Explanation:</p>
                <p className="text-muted-foreground">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <Button onClick={handleNext} className="w-full mt-6">
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
