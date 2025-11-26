import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, LogOut, Mail, School, Award } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const userType = localStorage.getItem("userType") || "student";
  const userName = localStorage.getItem("userName") || "Guest User";
  const userId = localStorage.getItem("userId") || "N/A";
  const classId = localStorage.getItem("classId") || "N/A";
  const userEmail = localStorage.getItem("userEmail") || "N/A";
  const school = localStorage.getItem("school") || "N/A";

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="p-8 text-center shadow-elevated">
            <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{userName}</h1>
            <p className="text-muted-foreground capitalize">{userType}</p>
          </Card>

          {/* Profile Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>
            <div className="space-y-4">
              {userType === "student" ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Roll Number</p>
                      <p className="font-medium text-foreground">{userId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <School className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Class ID</p>
                      <p className="font-medium text-foreground">{classId}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <School className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">School</p>
                      <p className="font-medium text-foreground">{school}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Stats Card */}
          {userType === "student" && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Lectures</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-3xl font-bold text-accent">85%</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <p className="text-3xl font-bold text-warning">5</p>
                  <p className="text-sm text-muted-foreground">Tests</p>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <p className="text-3xl font-bold text-destructive">7</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
