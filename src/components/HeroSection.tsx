import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Palette, Zap, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent to-primary rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your Perfect
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              AI Chatbot
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Design, customize, and deploy intelligent chatbots with beautiful themes. 
            Choose from multiple AI providers and integrate seamlessly into your applications.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-accent mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart AI Integration</h3>
            <p className="text-muted-foreground text-sm">
              Connect with OpenAI, Claude, Gemini, and more
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-accent mb-4">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Theme Designer</h3>
            <p className="text-muted-foreground text-sm">
              Create stunning custom themes with live preview
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary to-accent mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
            <p className="text-muted-foreground text-sm">
              One-click deployment to any website or app
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In / Sign Up
            </Button>
          )}
          <Button variant="glass" size="lg" className="text-lg px-8 py-6">
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10K+</div>
            <div className="text-sm text-muted-foreground">Chatbots Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">AI Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;