import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeDesigner from "./ThemeDesigner";
import ChatBotPreview from "./ChatBotPreview";
import AIProviderSelector from "./AIProviderSelector";
import { Button } from "@/components/ui/button";
import { Code, Download, Eye, Settings } from "lucide-react";

const ChatBotBuilder = () => {
  const [theme, setTheme] = useState({
    primaryColor: "#8B5CF6",
    secondaryColor: "#A855F7", 
    fontFamily: "font-sans",
    borderRadius: "lg",
    bubbleStyle: "modern"
  });

  const [selectedProvider, setSelectedProvider] = useState("openai");

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Design Your 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Chatbot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use our powerful theme designer to create a chatbot that perfectly matches your brand
          </p>
        </div>

        {/* Main Builder Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-6 bg-card/50 border border-border">
                <TabsTrigger value="theme" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  AI Provider
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Integration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="theme" className="space-y-6">
                <ThemeDesigner theme={theme} onThemeChange={setTheme} />
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <AIProviderSelector />
              </TabsContent>

              <TabsContent value="integration" className="space-y-6">
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      Integration Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                      <div className="text-muted-foreground mb-2">// Add to your website</div>
                      <div>{`<script src="https://chatbot-builder.com/widget.js"></script>`}</div>
                      <div>{`<script>`}</div>
                      <div className="ml-4">{`ChatBot.init({`}</div>
                      <div className="ml-8">{`id: "your-chatbot-id",`}</div>
                      <div className="ml-8">{`theme: "${theme.primaryColor}",`}</div>
                      <div className="ml-8">{`provider: "${selectedProvider}"`}</div>
                      <div className="ml-4">{`});`}</div>
                      <div>{`</script>`}</div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Widget
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Copy Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Integration Examples */}
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Popular Integrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "WordPress", desc: "Plugin available" },
                        { name: "Shopify", desc: "App store integration" },
                        { name: "React/Vue", desc: "NPM package" },
                        { name: "Webflow", desc: "Custom code embed" }
                      ].map((integration) => (
                        <div key={integration.name} className="p-3 border border-border rounded-lg">
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">{integration.desc}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatBotPreview theme={theme} />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button variant="hero" className="w-full">
                  Deploy Chatbot
                </Button>
                <Button variant="outline" className="w-full">
                  Save as Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatBotBuilder;