import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Wifi, Brain, Users } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import AetherLearnLogo from "@/components/AetherLearnLogo";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const { t } = useTranslation();

  // Check if user is logged in and redirect to dashboard
  const getLogoLink = () => {
    const userType = localStorage.getItem("userType");
    return userType ? "/dashboard" : "/";
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={getLogoLink()} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <AetherLearnLogo size="md" showText={false} />
            <span className="text-xl font-bold text-foreground hidden sm:inline">AetherLearn</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <Link to="/login">
              <Button variant="ghost">{t("header.login")}</Button>
            </Link>
            <Link to="/register">
              <Button>{t("header.getStarted")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              {t("hero.title")}
              <span className="text-primary"> {t("hero.subtitle")}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("hero.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="text-lg px-8">
                  {t("hero.loginStudent")}
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t("hero.loginTeacher")}
                </Button>
              </Link>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="lg" className="text-primary">
                {t("hero.exploreDemo")}
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
              {t("features.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-elevated transition-smooth">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t("features.offline.title")}</h3>
              <p className="text-muted-foreground">
                {t("features.offline.description")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-elevated transition-smooth">
              <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t("features.ai.title")}</h3>
              <p className="text-muted-foreground">
                {t("features.ai.description")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md hover:shadow-elevated transition-smooth">
              <div className="bg-warning/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t("features.collaborative.title")}</h3>
              <p className="text-muted-foreground">
                {t("features.collaborative.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-hero text-white rounded-3xl p-12 lg:p-20 text-center shadow-elevated">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {t("cta.registerNow")}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                {t("cta.tryDemo")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AetherLearnLogo size="sm" showText={false} />
            <span className="font-bold text-foreground">AetherLearn</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {t("footer.tagline")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
