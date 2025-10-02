import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ChatBotPreview from "@/components/ChatBotPreview";

interface ChatbotData {
  id: string;
  name: string;
  description: string;
  ai_provider: string;
  system_prompt: string;
  theme_config: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    bubbleStyle: string;
  };
}

const ChatbotEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatbot, setChatbot] = useState<ChatbotData>({
    id: "",
    name: "",
    description: "",
    ai_provider: "google/gemini-2.5-flash",
    system_prompt: "",
    theme_config: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#A855F7",
      fontFamily: "font-sans",
      borderRadius: "lg",
      bubbleStyle: "gradient",
    },
  });
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const loadChatbot = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load chatbot",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      const themeConfig = data.theme_config as any;
      setChatbot({
        ...data,
        theme_config: themeConfig || {
          primaryColor: "#8B5CF6",
          secondaryColor: "#A855F7",
          fontFamily: "font-sans",
          borderRadius: "lg",
          bubbleStyle: "gradient",
        },
      });
      setLoading(false);
    };

    loadChatbot();
  }, [id, navigate, toast]);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("chatbots")
      .update({
        name: chatbot.name,
        description: chatbot.description,
        ai_provider: chatbot.ai_provider,
        system_prompt: chatbot.system_prompt,
        theme_config: chatbot.theme_config,
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save chatbot",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Chatbot updated successfully",
      });
    }

    setSaving(false);
  };

  const updateThemeConfig = (updates: Partial<typeof chatbot.theme_config>) => {
    setChatbot(prev => ({
      ...prev,
      theme_config: { ...prev.theme_config, ...updates },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Edit Chatbot</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/chatbot/${id}/embed`)}>
                Get Embed Code
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Side - Live Preview */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full p-6 overflow-auto bg-muted/30">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Live Preview & Testing</h2>
                <ChatBotPreview 
                  theme={chatbot.theme_config}
                  systemPrompt={chatbot.system_prompt}
                  aiProvider={chatbot.ai_provider}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Side - Settings */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full p-6 overflow-auto">
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="ai">AI Settings</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Chatbot Name</Label>
                        <Input
                          id="name"
                          value={chatbot.name}
                          onChange={(e) => setChatbot(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter chatbot name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={chatbot.description || ""}
                          onChange={(e) => setChatbot(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your chatbot's purpose"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Theme Settings */}
                <TabsContent value="theme" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Theme Customization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Color Palette Presets */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Color Palette</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const palettes = [
                                { primary: "#8B5CF6", secondary: "#A855F7" },
                                { primary: "#3B82F6", secondary: "#60A5FA" },
                                { primary: "#10B981", secondary: "#34D399" },
                                { primary: "#EC4899", secondary: "#F472B6" },
                                { primary: "#F97316", secondary: "#FB923C" },
                                { primary: "#EF4444", secondary: "#F87171" },
                                { primary: "#14B8A6", secondary: "#2DD4BF" },
                                { primary: "#6366F1", secondary: "#818CF8" },
                              ];
                              const fontFamilies = ["font-sans", "font-serif", "font-mono"];
                              const borderRadii = ["sm", "md", "lg", "xl"];
                              const bubbleStyles = ["gradient", "solid", "outlined"];
                              
                              const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
                              const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
                              const randomRadius = borderRadii[Math.floor(Math.random() * borderRadii.length)];
                              const randomBubble = bubbleStyles[Math.floor(Math.random() * bubbleStyles.length)];
                              
                              updateThemeConfig({
                                primaryColor: randomPalette.primary,
                                secondaryColor: randomPalette.secondary,
                                fontFamily: randomFont,
                                borderRadius: randomRadius,
                                bubbleStyle: randomBubble,
                              });
                            }}
                          >
                            Generate Random Theme
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { name: "Purple", primary: "#8B5CF6", secondary: "#A855F7" },
                            { name: "Blue", primary: "#3B82F6", secondary: "#60A5FA" },
                            { name: "Green", primary: "#10B981", secondary: "#34D399" },
                            { name: "Pink", primary: "#EC4899", secondary: "#F472B6" },
                            { name: "Orange", primary: "#F97316", secondary: "#FB923C" },
                            { name: "Red", primary: "#EF4444", secondary: "#F87171" },
                            { name: "Teal", primary: "#14B8A6", secondary: "#2DD4BF" },
                            { name: "Indigo", primary: "#6366F1", secondary: "#818CF8" },
                          ].map((palette) => (
                            <button
                              key={palette.name}
                              onClick={() => updateThemeConfig({ 
                                primaryColor: palette.primary, 
                                secondaryColor: palette.secondary 
                              })}
                              className="group relative p-3 rounded-lg border-2 transition-all hover:scale-105"
                              style={{
                                background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                                borderColor: chatbot.theme_config.primaryColor === palette.primary ? 'hsl(var(--primary))' : 'transparent',
                              }}
                            >
                              <span className="text-xs font-medium text-white drop-shadow-md">
                                {palette.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Primary Color</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={chatbot.theme_config.primaryColor}
                              onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                              className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={chatbot.theme_config.primaryColor}
                              onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Secondary Color</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={chatbot.theme_config.secondaryColor}
                              onChange={(e) => updateThemeConfig({ secondaryColor: e.target.value })}
                              className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={chatbot.theme_config.secondaryColor}
                              onChange={(e) => updateThemeConfig({ secondaryColor: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={chatbot.theme_config.fontFamily}
                          onValueChange={(value) => updateThemeConfig({ fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="font-sans">Sans Serif</SelectItem>
                            <SelectItem value="font-serif">Serif</SelectItem>
                            <SelectItem value="font-mono">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Border Radius</Label>
                        <Select
                          value={chatbot.theme_config.borderRadius}
                          onValueChange={(value) => updateThemeConfig({ borderRadius: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                            <SelectItem value="xl">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Bubble Style</Label>
                        <Select
                          value={chatbot.theme_config.bubbleStyle}
                          onValueChange={(value) => updateThemeConfig({ bubbleStyle: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="outlined">Outlined</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* AI Settings */}
                <TabsContent value="ai" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ai-provider">AI Model</Label>
                        <Select
                          value={chatbot.ai_provider}
                          onValueChange={(value) => setChatbot(prev => ({ ...prev, ai_provider: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                            <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                            <SelectItem value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
                            <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                            <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system-prompt">System Prompt</Label>
                        <Textarea
                          id="system-prompt"
                          value={chatbot.system_prompt || ""}
                          onChange={(e) => setChatbot(prev => ({ ...prev, system_prompt: e.target.value }))}
                          placeholder="Define your chatbot's personality and behavior"
                          rows={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your AI provider API key"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Note: Lovable AI provides free testing credits. For production use, enter your own API key.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default ChatbotEditor;
