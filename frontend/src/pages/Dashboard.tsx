import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ClipboardCheck, FileText, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import LectureCard from "@/components/LectureCard";
import { Button } from "@/components/ui/button";
import lecturesData from "@/data/lectures.json";
import quizzesData from "@/data/quizzes.json";
import testsData from "@/data/tests.json";

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";

  // Calculate real stats from localStorage
  const quizScores = JSON.parse(localStorage.getItem("quizScores") || "{}");
  const testResults = JSON.parse(localStorage.getItem("testResults") || "[]");
  const completedLectures = JSON.parse(localStorage.getItem("completedLectures") || "[]");
  
  const quizAvg = Object.keys(quizScores).length > 0 
    ? Math.round(Object.values(quizScores).reduce((a: number, b: unknown) => a + (b as number), 0) / Object.keys(quizScores).length)
    : 0;

  const stats = [
    { icon: BookOpen, label: "Lectures Completed", value: completedLectures.length, bgColor: "bg-primary" },
    { icon: ClipboardCheck, label: "Quiz Average", value: `${quizAvg}%`, bgColor: "bg-accent" },
    { icon: FileText, label: "Tests Taken", value: testResults.length, bgColor: "bg-warning" },
    { icon: TrendingUp, label: "Total Lectures", value: lecturesData.lectures.length, bgColor: "bg-destructive" },
  ];

  // Transform lectures data for LectureCard component
  const lectures = lecturesData.lectures.map((lecture) => ({
    id: lecture.id,
    title: lecture.topic,
    subject: lecture.subject,
    duration: `${Math.ceil(lecture.duration_seconds / 60)} min`,
    progress: completedLectures.includes(lecture.id) ? 100 : 0,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Lectures Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Available Lectures</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lectures.map((lecture) => (
                <LectureCard key={lecture.id} {...lecture} />
              ))}
            </div>
          </section>

          {/* Tests Section */}
          {testsData.tests.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Available Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testsData.tests.map((test) => (
                  <div 
                    key={test.id}
                    className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => navigate(`/test/${test.id}`)}
                  >
                    <h3 className="font-semibold text-foreground mb-2">{test.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>⏱️ {test.duration_minutes} min</span>
                      <span>📝 {test.total_marks} marks</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-3">Ready for a Challenge?</h3>
              <p className="text-muted-foreground mb-4">
                Test your knowledge with our quizzes
              </p>
              <Button onClick={() => quizzesData.quizzes[0] && navigate(`/quiz/${quizzesData.quizzes[0].id}`)}>
                Take Quiz
              </Button>
            </div>

            <div className="bg-gradient-to-br from-warning/10 to-destructive/10 p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-3">Leaderboard</h3>
              <p className="text-muted-foreground mb-4">
                See how you rank against your classmates
              </p>
              <Button variant="outline" onClick={() => navigate("/leaderboard")}>
                View Rankings
              </Button>
            </div>
          </section>
      </main>
    </div>
  );
};

export default Dashboard;
