import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Plus, Bot, LogOut, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Chatbot {
  id: string;
  name: string;
  description: string;
  ai_provider: string;
  is_active: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: "",
    description: "",
    ai_provider: "google/gemini-2.5-flash",
    system_prompt: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setSession(session);
      setUser(session.user);

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Get user's chatbots
      const { data: chatbotsData, error: chatbotsError } = await supabase
        .from("chatbots")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (chatbotsError) {
        console.error("Error fetching chatbots:", chatbotsError);
        toast({
          title: "Error",
          description: "Failed to load your chatbots",
          variant: "destructive",
        });
      } else {
        setChatbots(chatbotsData || []);
      }

      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/auth");
        } else {
          setSession(session);
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleCreateChatbot = async () => {
    if (!user || !newBot.name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the chatbot name",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("chatbots")
      .insert([
        {
          user_id: user.id,
          name: newBot.name.trim(),
          description: newBot.description.trim(),
          ai_provider: newBot.ai_provider,
          system_prompt: newBot.system_prompt.trim(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to create chatbot",
        variant: "destructive",
      });
    } else {
      setChatbots(prev => [data, ...prev]);
      setIsCreateDialogOpen(false);
      setNewBot({
        name: "",
        description: "",
        ai_provider: "google/gemini-2.5-flash",
        system_prompt: ""
      });
      toast({
        title: "Success",
        description: "Chatbot created successfully!",
      });
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    const { error } = await supabase
      .from("chatbots")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to delete chatbot",
        variant: "destructive",
      });
    } else {
      setChatbots(prev => prev.filter(bot => bot.id !== id));
      toast({
        title: "Success",
        description: "Chatbot deleted successfully",
      });
    }
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
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">ChatBot Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.display_name || user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Chatbots</h2>
            <p className="text-muted-foreground">Create and manage your AI-powered chatbots</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>
                  Set up your new AI chatbot with custom settings and personality.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newBot.name}
                    onChange={(e) => setNewBot(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter chatbot name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBot.description}
                    onChange={(e) => setNewBot(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your chatbot's purpose"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ai-provider">AI Provider</Label>
                  <Select
                    value={newBot.ai_provider}
                    onValueChange={(value) => setNewBot(prev => ({ ...prev, ai_provider: value }))}
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
                <div className="grid gap-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={newBot.system_prompt}
                    onChange={(e) => setNewBot(prev => ({ ...prev, system_prompt: e.target.value }))}
                    placeholder="Define your chatbot's personality and behavior"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateChatbot}>Create Chatbot</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chatbots Grid */}
        {chatbots.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No chatbots yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first chatbot to get started with AI-powered conversations
              </CardDescription>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Chatbot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot) => (
              <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {chatbot.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <Badge variant={chatbot.is_active ? "default" : "secondary"}>
                      {chatbot.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <strong>AI Provider:</strong> {chatbot.ai_provider}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Created:</strong> {new Date(chatbot.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/chatbot/${chatbot.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteChatbot(chatbot.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;