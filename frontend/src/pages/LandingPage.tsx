import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Wifi, Brain, Users, Play, Star, ArrowRight, 
  Sparkles, Globe, Shield, Zap, CheckCircle2, ChevronRight,
  GraduationCap, Trophy, Clock, Download
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import AetherLearnLogo from "@/components/AetherLearnLogo";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const { t } = useTranslation();

  const getLogoLink = () => {
    const userType = localStorage.getItem("userType");
    return userType ? "/dashboard" : "/";
  };

  const features = [
    {
      icon: Wifi,
      title: t("features.offline.title"),
      description: t("features.offline.description"),
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Brain,
      title: t("features.ai.title"),
      description: t("features.ai.description"),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Users,
      title: t("features.collaborative.title"),
      description: t("features.collaborative.description"),
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Video Lectures" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Offline Access" },
  ];

  const benefits = [
    "AI-powered personalized learning paths",
    "Interactive 3D virtual classroom",
    "Progress tracking and analytics",
    "Multi-language support",
    "Works completely offline",
    "Gamified learning experience",
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-mesh opacity-50 pointer-events-none" />
      
      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="fixed top-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob delay-200 pointer-events-none" />
      <div className="fixed bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob delay-500 pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={getLogoLink()} className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <AetherLearnLogo size="md" showText={false} />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Aether<span className="gradient-text">Learn</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:flex">{t("header.login")}</Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary text-white border-0 shadow-glow hover:shadow-lg transition-all">
                {t("header.getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">AI-Powered Education Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-balance">
              {t("hero.title")}
              <span className="block gradient-text mt-2">{t("hero.subtitle")}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
              {t("hero.description")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg gradient-primary text-white border-0 shadow-glow hover:shadow-lg transition-all group">
                  {t("hero.loginStudent")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-primary/5 group">
                  <Play className="mr-2 w-5 h-5" />
                  {t("hero.exploreDemo")}
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Loved by 10,000+ students</p>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Preview */}
          <div className="relative animate-fade-up delay-200">
            {/* Main Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-500/30 to-accent/30 rounded-3xl blur-2xl opacity-60 animate-pulse-glow" />
              
              {/* Card */}
              <div className="relative glass-card rounded-3xl p-8 shadow-elevated">
                {/* 3D Classroom Preview */}
                <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center animate-float">
                        <GraduationCap className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-white/80 text-sm">3D Virtual Classroom</p>
                    </div>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <Link to="/lecture/1" className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </Link>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 rounded-xl bg-primary/5">
                    <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">500+ Lectures</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-accent/5">
                    <Trophy className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Gamified</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-500/5">
                    <Download className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                    <p className="text-xs text-muted-foreground">Offline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 glass-card rounded-2xl p-4 shadow-card animate-float delay-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Tutor</p>
                  <p className="text-xs text-muted-foreground">Ask anything!</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-6 glass-card rounded-2xl p-4 shadow-card animate-float delay-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">100% Offline</p>
                  <p className="text-xs text-muted-foreground">No internet needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Hover Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              
              <div className="relative glass-card p-8 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift h-full">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                
                {/* Learn More */}
                <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 bg-muted/30 py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm mb-6">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our easy 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-accent" />

            {[
              { step: "01", title: "Sign Up", desc: "Create your free account in seconds", icon: Users },
              { step: "02", title: "Choose Topics", desc: "Select subjects you want to learn", icon: BookOpen },
              { step: "03", title: "Start Learning", desc: "Enjoy immersive 3D lessons offline", icon: GraduationCap },
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Everything you need to
              <span className="gradient-text"> succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              AetherLearn combines cutting-edge AI with immersive 3D technology to deliver an unparalleled learning experience.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-primary/20 to-purple-500/20 rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-3xl p-8 shadow-elevated">
              <div className="space-y-6">
                {[
                  { icon: Clock, label: "Learn at your pace", value: "Self-paced courses" },
                  { icon: Trophy, label: "Earn achievements", value: "Gamified rewards" },
                  { icon: Brain, label: "AI assistance", value: "24/7 AI tutor" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 hover:bg-background transition-colors">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-purple-500/30 to-accent/30 rounded-[3rem] blur-3xl opacity-50" />
          
          <div className="relative gradient-primary rounded-[2.5rem] p-12 lg:p-20 text-center overflow-hidden">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
              }} />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t("cta.title")}
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90 shadow-lg">
                    {t("cta.registerNow")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-white text-white hover:bg-white/10">
                    {t("cta.tryDemo")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <AetherLearnLogo size="sm" showText={false} />
              <span className="font-bold text-foreground">
                Aether<span className="gradient-text">Learn</span>
              </span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
