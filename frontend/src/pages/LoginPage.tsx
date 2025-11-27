import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState({ classId: "", rollNumber: "", password: "" });
  const [teacherData, setTeacherData] = useState({ email: "", password: "" });

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData.classId || !studentData.rollNumber || !studentData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter Class ID, Roll Number, and Password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.login({
        userType: 'student',
        rollNumber: studentData.rollNumber,
        classId: studentData.classId,
        password: studentData.password,
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}!`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      // If backend is unavailable, fall back to offline mode
      if (error.message.includes('fetch')) {
        localStorage.setItem("userType", "student");
        localStorage.setItem("userId", studentData.rollNumber);
        localStorage.setItem("classId", studentData.classId);
        localStorage.setItem("userName", "Student");

        toast({
          title: "Offline Mode",
          description: "Connected locally. Data will sync when online.",
        });

        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherData.email || !teacherData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login({
        userType: 'teacher',
        email: teacherData.email,
        password: teacherData.password,
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}!`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        localStorage.setItem("userType", "teacher");
        localStorage.setItem("userEmail", teacherData.email);
        localStorage.setItem("userName", "Teacher");

        toast({
          title: "Offline Mode",
          description: "Connected locally. Data will sync when online.",
        });

        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">AetherLearn</span>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classId">Class ID</Label>
                <Input
                  id="classId"
                  placeholder="Enter your class ID"
                  value={studentData.classId}
                  onChange={(e) => setStudentData({ ...studentData, classId: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter your roll number"
                  value={studentData.rollNumber}
                  onChange={(e) => setStudentData({ ...studentData, rollNumber: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentPassword">Password</Label>
                <Input
                  id="studentPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={studentData.password}
                  onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Student"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="teacher">
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@example.com"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={teacherData.password}
                  onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Teacher"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
