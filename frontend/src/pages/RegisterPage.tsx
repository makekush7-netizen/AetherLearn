import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState({ name: "", rollNumber: "", classId: "" });
  const [teacherData, setTeacherData] = useState({ name: "", email: "", school: "", password: "" });

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentData.name || !studentData.rollNumber || !studentData.classId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Store user data
    localStorage.setItem("userType", "student");
    localStorage.setItem("userName", studentData.name);
    localStorage.setItem("userId", studentData.rollNumber);
    localStorage.setItem("classId", studentData.classId);

    toast({
      title: "Registration Successful",
      description: "Welcome to AetherLearn!",
    });

    navigate("/dashboard");
  };

  const handleTeacherRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherData.name || !teacherData.email || !teacherData.school || !teacherData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Store user data
    localStorage.setItem("userType", "teacher");
    localStorage.setItem("userName", teacherData.name);
    localStorage.setItem("userEmail", teacherData.email);
    localStorage.setItem("school", teacherData.school);

    toast({
      title: "Registration Successful",
      description: "Welcome to AetherLearn!",
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

        <h2 className="text-2xl font-bold text-center text-foreground mb-6">Create Account</h2>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <form onSubmit={handleStudentRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your name"
                  value={studentData.name}
                  onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentRoll">Roll Number</Label>
                <Input
                  id="studentRoll"
                  placeholder="Enter your roll number"
                  value={studentData.rollNumber}
                  onChange={(e) => setStudentData({ ...studentData, rollNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentClass">Class ID</Label>
                <Input
                  id="studentClass"
                  placeholder="Enter your class ID"
                  value={studentData.classId}
                  onChange={(e) => setStudentData({ ...studentData, classId: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Register as Student
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="teacher">
            <form onSubmit={handleTeacherRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Full Name</Label>
                <Input
                  id="teacherName"
                  placeholder="Enter your name"
                  value={teacherData.name}
                  onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherEmail">Email</Label>
                <Input
                  id="teacherEmail"
                  type="email"
                  placeholder="teacher@example.com"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input
                  id="school"
                  placeholder="Enter school name"
                  value={teacherData.school}
                  onChange={(e) => setTeacherData({ ...teacherData, school: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherPassword">Password</Label>
                <Input
                  id="teacherPassword"
                  type="password"
                  placeholder="Create a password"
                  value={teacherData.password}
                  onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Register as Teacher
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login here
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

export default RegisterPage;
