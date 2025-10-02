import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PlaceChatProps {
  placeName: string;
  placeCategory: string;
  placeDescription?: string;
}

const PlaceChat = ({ placeName, placeCategory, placeDescription }: PlaceChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `¡Hola! Soy el asistente virtual de ${placeName}. ¿En qué puedo ayudarte hoy?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('place-chat', {
        body: {
          messages: [...messages, userMessage],
          placeName,
          placeCategory,
          placeDescription: placeDescription || `Un ${placeCategory} en Cali`
        }
      });

      if (error) {
        console.error('Chat error:', error);
        throw error;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo.',
        variant: 'destructive'
      });
      
      // Remove the user message if the request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-20 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg z-50 transition-transform bg-[#25D366] hover:bg-[#128C7E] text-white',
          isOpen && 'scale-0'
        )}
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

      {/* Chat Window */}
      <Card
        className={cn(
          'fixed inset-x-4 bottom-4 md:bottom-6 md:right-6 md:left-auto md:w-[380px] h-[calc(100vh-8rem)] md:h-[500px] shadow-2xl z-50 flex flex-col transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        )}
      >
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 md:pb-4 border-b bg-[#25D366] text-white">
          <CardTitle className="text-base md:text-lg truncate pr-2">Chat con {placeName}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 text-white h-8 w-8 md:h-10 md:w-10"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] md:max-w-[80%] rounded-lg px-3 py-2 md:px-4',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-xs md:text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-3 md:p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-sm md:text-base"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()} 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white h-10 w-10 md:h-11 md:w-11 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PlaceChat;
