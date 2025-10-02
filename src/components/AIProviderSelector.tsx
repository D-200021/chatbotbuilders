import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Shield, Star } from "lucide-react";

interface AIProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
  performance: number;
  popularity: "Hot" | "Popular" | "New" | "";
}

const AIProviderSelector = () => {
  const providers: AIProvider[] = [
    {
      id: "openai",
      name: "OpenAI GPT-4",
      description: "Most advanced conversational AI with exceptional understanding and creativity",
      features: ["Advanced reasoning", "Creative responses", "Multilingual", "Code generation"],
      pricing: "$0.03 per 1K tokens",
      performance: 95,
      popularity: "Hot"
    },
    {
      id: "anthropic",
      name: "Claude 3",
      description: "Helpful, harmless, and honest AI assistant with strong safety measures",
      features: ["Safety focused", "Long context", "Analytical thinking", "Ethical reasoning"],
      pricing: "$0.025 per 1K tokens",
      performance: 92,
      popularity: "Popular"
    },
    {
      id: "google",
      name: "Gemini Pro",
      description: "Google's multimodal AI with strong integration capabilities",
      features: ["Multimodal", "Google integration", "Fast responses", "Real-time data"],
      pricing: "$0.02 per 1K tokens",
      performance: 88,
      popularity: ""
    },
    {
      id: "mistral",
      name: "Mistral AI",
      description: "Open-source focused AI with excellent performance and transparency",
      features: ["Open source", "EU compliant", "Fast inference", "Cost effective"],
      pricing: "$0.015 per 1K tokens",
      performance: 85,
      popularity: "New"
    }
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    return "text-orange-400";
  };

  const getPopularityBadge = (popularity: string) => {
    const variants = {
      "Hot": "bg-gradient-to-r from-red-500 to-orange-500",
      "Popular": "bg-gradient-to-r from-blue-500 to-purple-500",
      "New": "bg-gradient-to-r from-green-500 to-teal-500"
    };

    if (!popularity) return null;

    return (
      <Badge className={`${variants[popularity as keyof typeof variants]} text-white border-0`}>
        {popularity}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Choose Your AI Provider
        </h2>
        <p className="text-muted-foreground">
          Select the AI model that best fits your chatbot's needs
        </p>
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {provider.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {provider.description}
                    </p>
                  </div>
                </div>
                {getPopularityBadge(provider.popularity)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {provider.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Performance & Pricing */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Performance:</span>
                    <span className={`text-sm font-semibold ${getPerformanceColor(provider.performance)}`}>
                      {provider.performance}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Pricing:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {provider.pricing}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-primary hover:text-primary-foreground border-primary/20"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Select
                </Button>
              </div>

              {/* Performance Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Performance Score</span>
                  <span>{provider.performance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${provider.performance}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIProviderSelector;