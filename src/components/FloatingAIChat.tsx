import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, X, Send, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FloatingAIChat = ({ isHidden }: { isHidden?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente del Mundial del Sabor. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al conectar con el asistente');
      }

      if (!response.body) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';

      // Add assistant message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantMessage;
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar el mensaje',
        variant: 'destructive',
      });
      // Remove the empty assistant message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    await streamChat(userMessage);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '¡Hola! 👋 Soy tu asistente Sabor 360. ¿En qué puedo ayudarte hoy?'
      }
    ]);
    toast({
      title: "Chat limpiado",
      description: "La conversación ha sido reiniciada",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to render message content with clickable links
  const renderMessageContent = (content: string) => {
    // Split by newlines to preserve formatting
    const lines = content.split('\n');
    
    return (
      <div className="text-sm whitespace-pre-wrap break-words">
        {lines.map((line, lineIndex) => {
          const parts: (string | JSX.Element)[] = [];
          // Match markdown links: [text](/place/slug), [text](/event/slug), or [text](/event/id)
          const linkRegex = /\[([^\]]+)\]\((\/(?:place|event)\/[a-z0-9-]+)\)/g;
          let lastIndex = 0;
          let match;

          while ((match = linkRegex.exec(line)) !== null) {
            // Add text before the link
            if (match.index > lastIndex) {
              parts.push(line.slice(lastIndex, match.index));
            }
            
            // Add the clickable link
            const linkText = match[1];
            const linkUrl = match[2];
            parts.push(
              <button
                key={`${lineIndex}-${match.index}`}
                onClick={() => {
                  navigate(linkUrl);
                  setIsOpen(false);
                }}
                className="text-primary underline font-bold hover:text-primary/80 transition-colors inline-block"
              >
                {linkText}
              </button>
            );
            
            lastIndex = match.index + match[0].length;
          }

          // Add remaining text
          if (lastIndex < line.length) {
            parts.push(line.slice(lastIndex));
          }

          return (
            <div key={lineIndex}>
              {parts.length > 0 ? parts : line}
            </div>
          );
        })}
      </div>
    );
  };

  // Don't render anything if not on home page or if hidden
  if (!isHomePage || isHidden) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 h-14 md:h-16 px-4 md:px-6 rounded-2xl shadow-2xl z-[9999] bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105 animate-bounce flex items-center gap-2 md:gap-3"
        >
          <Bot className="h-6 w-6 md:h-8 md:w-8 animate-pulse" />
          <span className="font-semibold text-xs md:text-sm">¿Necesitas ayuda?</span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 md:bottom-6 right-4 md:right-6 left-4 md:left-auto w-auto md:w-96 h-[28rem] md:h-[32rem] shadow-2xl z-[9999] flex flex-col border-primary border-2 bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg font-semibold">
                Asistente Sabor 360
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="h-8 w-8 hover:bg-white/20 text-primary-foreground shrink-0"
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-white/20 text-primary-foreground shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.content === '' && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FloatingAIChat;
