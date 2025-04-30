import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lesson } from '@/lib/types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatAgentProps {
  lesson: Lesson;
}

export default function ChatAgent({ lesson }: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Hi there! I'm your learning assistant for "${lesson.title}". Feel free to ask me any questions about this lesson, and I'll do my best to help you understand the concepts better.`,
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate a sample response based on the lesson content
  const generateResponse = (question: string): string => {
    // In a real implementation, this would call an API to get a response
    // For now, we'll return a sample response related to the lesson
    const baseResponses = [
      `That's a great question about ${lesson.title}!`,
      `I'm happy to help you understand more about this topic.`,
      `In the context of ${lesson.title}, I can explain that concept.`
    ];
    
    // Extract some content from the lesson to make responses more relevant
    const lessonTexts = lesson.content
      .filter(item => item.type === 'text')
      .map(item => 'content' in item ? (item as any).content : '');
    
    const randomResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];
    let answer = randomResponse;
    
    // Add some lesson-specific content if available
    if (lessonTexts.length > 0) {
      const randomTextSnippet = lessonTexts[Math.floor(Math.random() * lessonTexts.length)];
      if (randomTextSnippet && randomTextSnippet.length > 0) {
        // Get a portion of the text to use in the response
        const startIndex = Math.floor(Math.random() * Math.max(1, randomTextSnippet.length - 100));
        const snippet = randomTextSnippet.substring(startIndex, startIndex + 100) + '...';
        answer += ` ${snippet}`;
      }
    }
    
    return answer;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Add agent response
      const response = generateResponse(inputValue);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-xl overflow-hidden bg-slate-50">
      <div className="bg-primary text-white p-3">
        <h3 className="font-medium">Lesson Assistant</h3>
        <p className="text-xs opacity-80">Ask any questions about {lesson.title}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={cn(
              "flex", 
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <Card className={cn(
              "max-w-[80%]",
              message.sender === 'user' 
                ? "bg-primary text-white" 
                : "bg-white"
            )}>
              <CardContent className="p-3">
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] bg-white">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t bg-white">
        <form 
          className="flex items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about this lesson..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}