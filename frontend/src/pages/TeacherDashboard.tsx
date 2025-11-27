import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, BookOpen, ClipboardCheck, FileText, Plus, Copy, Share2,
  AlertTriangle, TrendingUp, Clock, ChevronRight, Search,
  MoreVertical, Eye, Trash2, Settings, CheckCircle2, XCircle,
  GraduationCap, Target, Calendar, ArrowRight, Sparkles, RefreshCw
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import lecturesData from "@/data/lectures.json";

// Generate a memorable class code
const generateClassCode = () => {
  const adjectives = ['SWIFT', 'BRIGHT', 'SMART', 'KEEN', 'BOLD', 'WISE'];
  const subjects = ['SCI', 'MATH', 'ENG', 'PHY', 'CHEM', 'BIO'];
  const numbers = Math.floor(Math.random() * 900) + 100;
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const subj = subjects[Math.floor(Math.random() * subjects.length)];
  return `${adj}-${subj}-${numbers}`;
};

// Mock data for students (in production, this comes from API)
const mockStudents = [
  { id: 1, name: "Rahul Singh", rollNumber: "101", progress: 85, lastActive: "2 hours ago", status: "active", lecturesCompleted: 8, quizzesPassed: 5 },
  { id: 2, name: "Priya Patel", rollNumber: "102", progress: 92, lastActive: "1 hour ago", status: "active", lecturesCompleted: 10, quizzesPassed: 7 },
  { id: 3, name: "Amit Kumar", rollNumber: "103", progress: 45, lastActive: "5 days ago", status: "at-risk", lecturesCompleted: 4, quizzesPassed: 2 },
  { id: 4, name: "Sneha Sharma", rollNumber: "104", progress: 78, lastActive: "Yesterday", status: "active", lecturesCompleted: 7, quizzesPassed: 4 },
  { id: 5, name: "Vikram Reddy", rollNumber: "105", progress: 30, lastActive: "1 week ago", status: "at-risk", lecturesCompleted: 2, quizzesPassed: 1 },
  { id: 6, name: "Ananya Gupta", rollNumber: "106", progress: 95, lastActive: "Just now", status: "active", lecturesCompleted: 11, quizzesPassed: 8 },
  { id: 7, name: "Kiran Verma", rollNumber: "107", progress: 60, lastActive: "3 days ago", status: "inactive", lecturesCompleted: 5, quizzesPassed: 3 },
  { id: 8, name: "Deepa Nair", rollNumber: "108", progress: 88, lastActive: "4 hours ago", status: "active", lecturesCompleted: 9, quizzesPassed: 6 },
];

// Mock classes
const mockClasses = [
  { id: 1, name: "Class 8-A Science", code: "BRIGHT-SCI-472", students: 32, avgProgress: 78, activeToday: 24 },
  { id: 2, name: "Class 9-B Physics", code: "SMART-PHY-891", students: 28, avgProgress: 65, activeToday: 18 },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const teacherName = localStorage.getItem("userName") || "Teacher";
  
  const [classes, setClasses] = useState(mockClasses);
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]);
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCode, setNewClassCode] = useState(generateClassCode());
  const [isAssignLectureOpen, setIsAssignLectureOpen] = useState(false);

  // Filter students based on search
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.includes(searchQuery)
  );

  // Get at-risk students
  const atRiskStudents = students.filter(s => s.status === "at-risk");

  // Stats
  const totalStudents = students.length;
  const avgProgress = Math.round(students.reduce((a, b) => a + b.progress, 0) / students.length);
  const activeToday = students.filter(s => s.status === "active").length;

  // Copy class code to clipboard
  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Class code copied to clipboard",
    });
  };

  // Share class code
  const shareClassCode = async (code: string, className: string) => {
    const shareText = `Join my class "${className}" on AetherLearn!\n\nClass Code: ${code}\n\nDownload AetherLearn and enter this code to join.`;
    
    if (navigator.share) {
      await navigator.share({
        title: "Join my AetherLearn class",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Share message copied to clipboard",
      });
    }
  };

  // Create new class
  const createClass = () => {
    if (!newClassName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a class name",
        variant: "destructive",
      });
      return;
    }

    const newClass = {
      id: classes.length + 1,
      name: newClassName,
      code: newClassCode,
      students: 0,
      avgProgress: 0,
      activeToday: 0,
    };

    setClasses([...classes, newClass]);
    setSelectedClass(newClass);
    setIsCreateClassOpen(false);
    setNewClassName("");
    setNewClassCode(generateClassCode());

    toast({
      title: "Class Created!",
      description: `${newClassName} has been created. Share the code with your students.`,
    });
  };

  // Regenerate class code
  const regenerateCode = () => {
    setNewClassCode(generateClassCode());
  };

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
                    Welcome, <span className="gradient-text">{teacherName}</span>!
                  </h1>
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <p className="text-muted-foreground text-lg">
                  Manage your classes and monitor student progress
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-3">
                <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white border-0 shadow-glow hover:shadow-lg transition-all">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Class</DialogTitle>
                      <DialogDescription>
                        Create a class and share the code with your students
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Class Name</label>
                        <Input 
                          placeholder="e.g., Class 8-A Science"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Class Code</label>
                        <div className="flex gap-2">
                          <div className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-lg font-bold text-center">
                            {newClassCode}
                          </div>
                          <Button variant="outline" size="icon" onClick={regenerateCode}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Students will use this code to join your class
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateClassOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createClass} className="gradient-primary text-white">
                        Create Class
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Class Selector & Code */}
          <div className="mb-8 animate-fade-up delay-100">
            <div className="glass-card rounded-3xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <select 
                      className="text-2xl font-bold bg-transparent border-none focus:outline-none cursor-pointer"
                      value={selectedClass.id}
                      onChange={(e) => setSelectedClass(classes.find(c => c.id === Number(e.target.value)) || classes[0])}
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <p className="text-muted-foreground">{selectedClass.students} students enrolled</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-primary/10 rounded-xl border-2 border-dashed border-primary/30">
                    <span className="text-sm text-muted-foreground">Class Code:</span>
                    <span className="ml-2 font-mono font-bold text-lg text-primary">{selectedClass.code}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => copyClassCode(selectedClass.code)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => shareClassCode(selectedClass.code, selectedClass.name)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Students", value: totalStudents, gradient: "from-violet-500 to-purple-600" },
              { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%`, gradient: "from-emerald-500 to-teal-600" },
              { icon: Clock, label: "Active Today", value: activeToday, gradient: "from-amber-500 to-orange-600" },
              { icon: AlertTriangle, label: "At Risk", value: atRiskStudents.length, gradient: "from-rose-500 to-pink-600" },
            ].map((stat, index) => (
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

          {/* At Risk Students Alert */}
          {atRiskStudents.length > 0 && (
            <div className="mb-8 animate-fade-up delay-200">
              <div className="glass-card rounded-2xl p-6 border-l-4 border-rose-500 bg-rose-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Students Needing Attention</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      These students have been inactive for 3+ days or have low progress
                    </p>
                    <div className="space-y-2">
                      {atRiskStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-sm font-medium">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">Last active: {student.lastActive}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-rose-500">{student.progress}% progress</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="mb-8 animate-fade-up delay-300">
            <div className="glass-card rounded-3xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Student Progress</h2>
                    <p className="text-sm text-muted-foreground">Monitor individual performance</p>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search students..."
                    className="pl-10 w-full lg:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Roll No.</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Lectures</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quizzes</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={student.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                              student.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                              student.status === 'at-risk' ? 'bg-rose-500/20 text-rose-500' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{student.rollNumber}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Progress value={student.progress} className="w-20 h-2" />
                            <span className="text-sm font-medium">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{student.lecturesCompleted}</td>
                        <td className="py-4 px-4 text-muted-foreground">{student.quizzesPassed}</td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">{student.lastActive}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                            student.status === 'at-risk' ? 'bg-rose-500/20 text-rose-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {student.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                            {student.status === 'at-risk' && <AlertTriangle className="w-3 h-3" />}
                            {student.status === 'inactive' && <Clock className="w-3 h-3" />}
                            {student.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-rose-500">
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-up delay-400">
            {/* Assign Lectures */}
            <div className="glass-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover-lift">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Assign Lectures</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Select from our library of lectures for your class
              </p>
              <Dialog open={isAssignLectureOpen} onOpenChange={setIsAssignLectureOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Browse Lectures <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Assign Lectures</DialogTitle>
                    <DialogDescription>
                      Select lectures to assign to {selectedClass.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto space-y-2 py-4">
                    {lecturesData.lectures.map(lecture => (
                      <div key={lecture.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{lecture.topic}</p>
                            <p className="text-xs text-muted-foreground">{lecture.subject} • {Math.ceil(lecture.duration_seconds / 60)} min</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Assign</Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* View Quizzes */}
            <div className="glass-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quiz Results</h3>
              <p className="text-muted-foreground text-sm mb-4">
                View quiz scores and performance analytics
              </p>
              <Button variant="outline" className="w-full">
                View Results <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Upload Test */}
            <div className="glass-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover-lift">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Tests & Exams</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload tests and view student submissions
              </p>
              <Button variant="outline" className="w-full">
                Manage Tests <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default TeacherDashboard;
