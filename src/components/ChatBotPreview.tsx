import { useState, useRef, useEffect } from "react";
import { Send, Maximize2, Monitor, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotPreviewProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    bubbleStyle: string;
  };
  systemPrompt?: string;
  aiProvider?: string;
}

type ViewMode = "mobile" | "web" | "fullscreen";

const ChatBotPreview = ({ theme, systemPrompt, aiProvider }: ChatBotPreviewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("web");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
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
            systemPrompt: systemPrompt || "You are a helpful AI assistant.",
            aiProvider: aiProvider || "google/gemini-2.5-flash",
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

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

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
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
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
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContainerStyles = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-[375px] mx-auto";
      case "web":
        return "max-w-2xl mx-auto";
      case "fullscreen":
        return "w-full h-full";
      default:
        return "max-w-2xl mx-auto";
    }
  };

  const containerHeight = viewMode === "fullscreen" ? "calc(100vh - 8rem)" : "600px";

  return (
    <div className="h-full flex flex-col">
      {/* View Mode Controls */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-muted/30 rounded-lg">
        <Button
          variant={viewMode === "mobile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("mobile")}
          className="gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
        <Button
          variant={viewMode === "web" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("web")}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Web
        </Button>
        <Button
          variant={viewMode === "fullscreen" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("fullscreen")}
          className="gap-2"
        >
          <Maximize2 className="h-4 w-4" />
          Fullscreen
        </Button>
      </div>

      {/* Preview Container */}
      <div className={`flex-1 ${getContainerStyles()} transition-all duration-300`}>
        <div
          className={`bg-card border border-border shadow-xl flex flex-col overflow-hidden ${
            theme.borderRadius === "sm" ? "rounded-sm" :
            theme.borderRadius === "md" ? "rounded-md" :
            theme.borderRadius === "lg" ? "rounded-lg" :
            "rounded-xl"
          } ${theme.fontFamily}`}
          style={{ height: containerHeight }}
        >
          {/* Chat Header */}
          <div
            className="p-4 text-white"
            style={{
              background: theme.bubbleStyle === "gradient"
                ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                : theme.primaryColor,
            }}
          >
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <p className="text-sm opacity-90">Test your chatbot here</p>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 ${message.role === "user" ? "bg-muted" : ""} ${
                      theme.borderRadius === "sm" ? "rounded-sm" :
                      theme.borderRadius === "md" ? "rounded-md" :
                      theme.borderRadius === "lg" ? "rounded-lg" :
                      "rounded-xl"
                    }`}
                    style={
                      message.role === "assistant"
                        ? {
                            background: theme.bubbleStyle === "gradient"
                              ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                              : theme.bubbleStyle === "outlined"
                              ? "transparent"
                              : theme.primaryColor,
                            color: theme.bubbleStyle === "outlined" ? theme.primaryColor : "white",
                            border: theme.bubbleStyle === "outlined" ? `2px solid ${theme.primaryColor}` : "none",
                          }
                        : {}
                    }
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className={`p-3 ${
                      theme.borderRadius === "sm" ? "rounded-sm" :
                      theme.borderRadius === "md" ? "rounded-md" :
                      theme.borderRadius === "lg" ? "rounded-lg" :
                      "rounded-xl"
                    }`}
                    style={{
                      background: theme.bubbleStyle === "gradient"
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
          <div className="p-4 border-t border-border">
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
                  background: theme.bubbleStyle === "gradient"
                    ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    : theme.primaryColor,
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPreview;
