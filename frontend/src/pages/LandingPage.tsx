import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Wifi, Brain, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">AetherLearn</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Interactive Learning,
              <span className="text-primary"> Even Offline</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-powered 3D virtual classrooms designed for areas with limited internet connectivity. 
              Experience immersive education that works anywhere, anytime.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="text-lg px-8">
                  Login as Student
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Login as Teacher
                </Button>
              </Link>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="lg" className="text-primary">
                Explore Demo →
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 rounded-3xl flex items-center justify-center shadow-elevated">
              <BookOpen className="h-48 w-48 text-primary/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose AetherLearn?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bridging the digital divide with innovative offline-first technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-elevated transition-smooth">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Offline-First</h3>
              <p className="text-muted-foreground">
                Works seamlessly without internet. All content syncs automatically when online.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-elevated transition-smooth">
              <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered</h3>
              <p className="text-muted-foreground">
                Intelligent 3D virtual classrooms with interactive lessons and instant feedback.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-elevated transition-smooth">
              <div className="bg-warning/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Collaborative</h3>
              <p className="text-muted-foreground">
                Gamified learning with leaderboards, quizzes, and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-hero text-white rounded-3xl p-12 lg:p-20 text-center shadow-elevated">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Education?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students and teachers already using AetherLearn
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Register Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">AetherLearn</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AetherLearn - Built for Education Hackathon 2025
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Interactive Learning, Even Offline
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
