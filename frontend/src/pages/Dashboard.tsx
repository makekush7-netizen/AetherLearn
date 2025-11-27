import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, ClipboardCheck, FileText, TrendingUp, 
  Play, Clock, Trophy, Sparkles, ChevronRight, 
  Flame, Target, Calendar, ArrowRight, GraduationCap
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

  const totalProgress = Math.round((completedLectures.length / lecturesData.lectures.length) * 100);

  const stats = [
    { 
      icon: BookOpen, 
      label: "Lectures", 
      value: `${completedLectures.length}/${lecturesData.lectures.length}`, 
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10"
    },
    { 
      icon: ClipboardCheck, 
      label: "Quiz Score", 
      value: `${quizAvg}%`, 
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10"
    },
    { 
      icon: FileText, 
      label: "Tests Taken", 
      value: testResults.length, 
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-600/10"
    },
    { 
      icon: Flame, 
      label: "Day Streak", 
      value: "7 🔥", 
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-500/10 to-pink-600/10"
    },
  ];

  // Transform lectures data
  const lectures = lecturesData.lectures.map((lecture) => ({
    id: lecture.id,
    title: lecture.topic,
    subject: lecture.subject,
    duration: Math.ceil(lecture.duration_seconds / 60),
    isCompleted: completedLectures.includes(lecture.id),
  }));

  return (
    <Sidebar>
      <div className="relative">
        {/* Background Effects */}
        <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />
        <div className="fixed top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Welcome back, <span className="gradient-text">{userName}</span>!
                </h1>
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-muted-foreground text-lg">
                Ready to continue your learning journey?
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate(`/lecture/${lectures[0]?.id || 1}`)}
                className="gradient-primary text-white border-0 shadow-glow hover:shadow-lg transition-all group"
              >
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="mb-8 animate-fade-up delay-100">
          <div className="glass-card rounded-3xl p-6 lg:p-8 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                </div>
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-5xl font-bold gradient-text">{totalProgress}%</span>
                  <span className="text-muted-foreground pb-2">completed</span>
                </div>
                <Progress value={totalProgress} className="h-3 bg-muted" />
              </div>
              
              <div className="flex gap-6 lg:gap-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                    <Trophy className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{completedLectures.length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-2 mx-auto">
                    <Calendar className="w-7 h-7 text-accent" />
                  </div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group glass-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift animate-fade-up"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Lectures Section */}
        <section className="mb-8 animate-fade-up delay-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Continue Learning</h2>
                <p className="text-sm text-muted-foreground">{lectures.length} lectures available</p>
              </div>
            </div>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {lectures.map((lecture, index) => (
              <div 
                key={lecture.id}
                onClick={() => navigate(`/lecture/${lecture.id}`)}
                className="group glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift cursor-pointer"
                style={{ animationDelay: `${(index + 4) * 50}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-primary ml-0.5" />
                    </div>
                  </div>

                  {/* Status Badge */}
                  {lecture.isCompleted && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent text-white text-xs font-medium flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Done
                    </div>
                  )}

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lecture.duration} min
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mb-2">
                    {lecture.subject}
                  </span>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {lecture.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tests Section */}
        {testsData.tests.length > 0 && (
          <section className="mb-8 animate-fade-up delay-400">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Assessments</h2>
                  <p className="text-sm text-muted-foreground">Test your knowledge</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testsData.tests.map((test) => (
                <div 
                  key={test.id}
                  onClick={() => navigate(`/test/${test.id}`)}
                  className="group glass-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-500" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{test.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {test.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" /> {test.total_marks} marks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section className="grid md:grid-cols-2 gap-6 animate-fade-up delay-500">
          <div className="relative group glass-card rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready for a Quiz?</h3>
              <p className="text-muted-foreground mb-4">
                Challenge yourself and test your understanding
              </p>
              <Button 
                onClick={() => quizzesData.quizzes[0] && navigate(`/quiz/${quizzesData.quizzes[0].id}`)}
                className="gradient-primary text-white border-0"
              >
                Start Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="relative group glass-card rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
              <p className="text-muted-foreground mb-4">
                See how you rank against other students
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/leaderboard")}
                className="border-2"
              >
                View Rankings
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
        </div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;
