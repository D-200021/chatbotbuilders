import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EmbedInstructions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const installCode = `npm install @supabase/supabase-js`;
  
  const importCode = `import EmbeddableChatbot from './components/EmbeddableChatbot';`;
  
  const usageCode = `<EmbeddableChatbot id="${id}" />`;

  const componentCode = `// Copy the entire EmbeddableChatbot.tsx component file
// from src/components/EmbeddableChatbot.tsx 
// into your project's components folder`;

  const envCode = `VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key`;

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
              <h1 className="text-xl font-bold">Embed Instructions</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>How to Integrate Your Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Follow these steps to integrate your chatbot into any React application:
              </p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">1. Install Dependencies</h3>
              <p className="text-sm text-muted-foreground">
                First, install the required Supabase client library:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{installCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(installCode, 0)}
                >
                  {copiedIndex === 0 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">2. Copy the Component</h3>
              <p className="text-sm text-muted-foreground">
                Copy the EmbeddableChatbot component from this project to your application:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{componentCode}</code>
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                The component is located at: <code className="bg-muted px-1 py-0.5 rounded">src/components/EmbeddableChatbot.tsx</code>
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">3. Configure Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Add your Supabase credentials to your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{envCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(envCode, 2)}
                >
                  {copiedIndex === 2 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">4. Import and Use</h3>
              <p className="text-sm text-muted-foreground">
                Import the component in your React application:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{importCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(importCode, 3)}
                >
                  {copiedIndex === 3 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">5. Add to Your Page</h3>
              <p className="text-sm text-muted-foreground">
                Use the chatbot component with your chatbot ID:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{usageCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(usageCode, 4)}
                >
                  {copiedIndex === 4 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="border-t pt-6 space-y-2">
              <h3 className="text-lg font-semibold">Important Notes</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Make sure you have the same Supabase database schema in your project</li>
                <li>The chatbot will appear as a floating button in the bottom-right corner</li>
                <li>All styling is customizable through the chatbot editor</li>
                <li>The component requires React 18+ and Tailwind CSS</li>
                <li>Make sure your edge function <code className="bg-muted px-1 py-0.5 rounded">chat-with-bot</code> is deployed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmbedInstructions;
