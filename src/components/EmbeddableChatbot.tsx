import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EmbeddableChatbotProps {
  id: string; // Chatbot ID from database
}

interface ChatbotConfig {
  name: string;
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

const EmbeddableChatbot = ({ id }: EmbeddableChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const themeConfig = data.theme_config as any;
        setConfig({
          name: data.name,
          ai_provider: data.ai_provider,
          system_prompt: data.system_prompt,
          theme_config: themeConfig || {
            primaryColor: "#8B5CF6",
            secondaryColor: "#A855F7",
            fontFamily: "font-sans",
            borderRadius: "lg",
            bubbleStyle: "gradient",
          },
        });
        setMessages([
          { role: "assistant", content: "Hello! How can I help you today?" },
        ]);
      }
    };

    loadConfig();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !config) return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-bot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            chatbotId: id,
            systemPrompt: config.system_prompt || "You are a helpful AI assistant.",
            aiProvider: config.ai_provider || "google/gemini-2.5-flash",
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as
              | string
              | undefined;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch {
            continue;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!config) return null;

  const theme = config.theme_config;

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
          style={{
            background:
              theme.bubbleStyle === "gradient"
                ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                : theme.primaryColor,
          }}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 h-[600px] bg-card border border-border shadow-2xl flex flex-col overflow-hidden z-50 ${
            theme.borderRadius === "sm"
              ? "rounded-sm"
              : theme.borderRadius === "md"
              ? "rounded-md"
              : theme.borderRadius === "lg"
              ? "rounded-lg"
              : "rounded-xl"
          } ${theme.fontFamily}`}
        >
          {/* Chat Header */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{
              background:
                theme.bubbleStyle === "gradient"
                  ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  : theme.primaryColor,
            }}
          >
            <div>
              <h3 className="font-semibold text-lg">{config.name}</h3>
              <p className="text-sm opacity-90">Online</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-background" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 ${message.role === "user" ? "bg-muted" : ""} ${
                      theme.borderRadius === "sm"
                        ? "rounded-sm"
                        : theme.borderRadius === "md"
                        ? "rounded-md"
                        : theme.borderRadius === "lg"
                        ? "rounded-lg"
                        : "rounded-xl"
                    }`}
                    style={
                      message.role === "assistant"
                        ? {
                            background:
                              theme.bubbleStyle === "gradient"
                                ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                                : theme.bubbleStyle === "outlined"
                                ? "transparent"
                                : theme.primaryColor,
                            color:
                              theme.bubbleStyle === "outlined"
                                ? theme.primaryColor
                                : "white",
                            border:
                              theme.bubbleStyle === "outlined"
                                ? `2px solid ${theme.primaryColor}`
                                : "none",
                          }
                        : {}
                    }
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className={`p-3 ${
                      theme.borderRadius === "sm"
                        ? "rounded-sm"
                        : theme.borderRadius === "md"
                        ? "rounded-md"
                        : theme.borderRadius === "lg"
                        ? "rounded-lg"
                        : "rounded-xl"
                    }`}
                    style={{
                      background:
                        theme.bubbleStyle === "gradient"
                          ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                          : theme.primaryColor,
                      color: "white",
                    }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="text-white"
                style={{
                  background:
                    theme.bubbleStyle === "gradient"
                      ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                      : theme.primaryColor,
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmbeddableChatbot;
