import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState({ classId: "", rollNumber: "" });
  const [teacherData, setTeacherData] = useState({ email: "", password: "" });

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData.classId || !studentData.rollNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both Class ID and Roll Number",
        variant: "destructive",
      });
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("userType", "student");
    localStorage.setItem("userId", studentData.rollNumber);
    localStorage.setItem("classId", studentData.classId);

    toast({
      title: "Login Successful",
      description: "Welcome back, student!",
    });

    navigate("/dashboard");
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherData.email || !teacherData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("userType", "teacher");
    localStorage.setItem("userEmail", teacherData.email);

    toast({
      title: "Login Successful",
      description: "Welcome back, teacher!",
    });

    navigate("/dashboard");
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter your roll number"
                  value={studentData.rollNumber}
                  onChange={(e) => setStudentData({ ...studentData, rollNumber: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Login as Student
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
                />
              </div>

              <Button type="submit" className="w-full">
                Login as Teacher
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
