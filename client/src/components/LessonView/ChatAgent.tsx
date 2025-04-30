import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lesson } from '@/lib/types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  keyPoints?: string[];
  suggestedQuestions?: string[];
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
      timestamp: new Date(),
      suggestedQuestions: [
        `What are the main concepts in ${lesson.title}?`,
        `Can you explain the key terms from this lesson?`,
        `How does ${lesson.title} relate to personal finance?`
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create a reference for the askMoreAboutTerm function
  const askMoreAboutTermRef = useRef<(term: string) => void>();
  
  // Set up the global function for term clicking
  useEffect(() => {
    // Create the function to handle term clicks
    askMoreAboutTermRef.current = (term: string) => {
      if (isLoading) return;
      
      const question = `Tell me more about ${term}`;
      handleSendMessage(question);
    };
    
    // Expose it to the window for the onClick handler
    (window as any).askMoreAboutTerm = (term: string) => {
      askMoreAboutTermRef.current?.(term);
    };
    
    // Cleanup
    return () => {
      delete (window as any).askMoreAboutTerm;
    };
  }, []); // Empty dependency array, we'll use the ref to get current state

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract key terms from the lesson content
  const extractKeyTerms = (text: string): string[] => {
    // This is a simplified implementation that could be improved with NLP
    const commonFinancialTerms = [
      'money', 'bank', 'credit', 'debt', 'interest', 'loan', 
      'budget', 'saving', 'spending', 'emergency fund', 'investment',
      'financial', 'account', 'deposit', 'withdraw', 'balance',
      'APY', 'APR', 'principal', 'compound interest', 'credit score'
    ];
    
    return commonFinancialTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 3); // Limit to 3 terms
  };

  // Generate suggested questions based on the content
  const generateSuggestedQuestions = (text: string, lessonTitle: string): string[] => {
    const keyTerms = extractKeyTerms(text);
    const questions = [
      `What is the difference between ${keyTerms[0] || 'saving'} and ${keyTerms[1] || 'investing'}?`,
      `How does ${keyTerms[0] || 'this concept'} apply to real-life situations?`,
      `Why is ${keyTerms[0] || 'this topic'} important for my financial future?`,
      `Can you provide examples of ${keyTerms[0] || 'this concept'} in everyday life?`,
      `What's the relationship between ${lessonTitle} and ${keyTerms[0] || 'personal finance'}?`
    ];
    
    // Return 3 random questions from the list
    return questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  // Extract key points from text
  const extractKeyPoints = (text: string): string[] => {
    // Split text into sentences
    const sentences = text.split(/[.!?]+/);
    
    // Filter out short sentences and intro phrases
    const filteredSentences = sentences.filter(s => {
      const trimmed = s.trim();
      // Skip sentences that are too short or contain intro phrases
      return trimmed.length > 20 && 
             !trimmed.toLowerCase().includes("i can explain") &&
             !trimmed.toLowerCase().includes("that's a great question") &&
             !trimmed.toLowerCase().includes("happy to help") &&
             !trimmed.toLowerCase().includes("in the context of") &&
             !trimmed.toLowerCase().includes("let me help") &&
             !trimmed.toLowerCase().includes("clarify");
    });
    
    // Return 2-3 meaningful sentences
    return filteredSentences
      .slice(0, Math.min(3, filteredSentences.length))
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  // Format text with highlighted terms that are clickable using a custom handler
  const formatWithHighlights = (text: string): string => {
    const keyTerms = extractKeyTerms(text);
    let formattedText = text;
    
    // Add bold to key terms
    keyTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      formattedText = formattedText.replace(
        regex, 
        `<strong class="cursor-pointer hover:text-primary" 
        data-term="${term}" 
        onclick="(function() { 
          const term = this.getAttribute('data-term'); 
          window.askMoreAboutTerm(term);
        }).call(this)">${term}</strong>`
      );
    });
    
    return formattedText;
  };

  // Generate a sample response based on the lesson content
  const generateResponse = (question: string): {text: string, keyPoints: string[], suggestedQuestions: string[]} => {
    // In a real implementation, this would call an API to get a response
    // For now, we'll return a sample response related to the lesson and the question
    
    // Extract all text content from the lesson to make responses more relevant
    const lessonTexts = lesson.content
      .filter(item => item.type === 'text')
      .map(item => 'content' in item ? (item as any).content : '')
      .filter(content => content && content.length > 0);
    
    // If we don't have content, use a generic response
    if (lessonTexts.length === 0) {
      const genericResponse = `I'd be happy to help you understand more about ${lesson.title}, but I don't have specific details about this lesson yet.`;
      return {
        text: genericResponse,
        keyPoints: [],
        suggestedQuestions: [
          `What topics are covered in ${lesson.title}?`,
          `Why is ${lesson.title} important?`,
          `How can I apply what I learn in ${lesson.title}?`
        ]
      };
    }
    
    // Prepare a proper response with intro
    const introOptions = [
      `That's a great question about ${lesson.title}! `,
      `I'm happy to help you understand more about this topic. `,
      `Great question! `
    ];
    
    const intro = introOptions[Math.floor(Math.random() * introOptions.length)];
    
    // Choose a substantive content snippet
    const contentSnippet = lessonTexts[Math.floor(Math.random() * lessonTexts.length)];
    
    // Combine intro and content
    const answer = intro + contentSnippet;
    
    // Extract key points from just the content portion (not the intro)
    const keyPoints = extractKeyPoints(contentSnippet);
    
    // Generate suggested follow-up questions
    const suggestedQuestions = generateSuggestedQuestions(contentSnippet, lesson.title);
    
    // Format the answer with highlighted terms
    const formattedAnswer = formatWithHighlights(answer);
    
    return {
      text: formattedAnswer,
      keyPoints,
      suggestedQuestions
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    // Use provided message text or input value
    const textToSend = messageText || inputValue;
    
    if (!textToSend.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate response with key points and suggested questions
      const { text, keyPoints, suggestedQuestions } = generateResponse(textToSend);
      
      // Add agent response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: 'agent',
        timestamp: new Date(),
        keyPoints,
        suggestedQuestions
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handler for clicking a suggested question - automatically sends the question
  const handleSuggestedQuestionClick = (question: string) => {
    setInputValue(question);
    // Small delay to ensure the input is updated before sending
    setTimeout(() => {
      handleSendMessage(question);
    }, 100);
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden bg-slate-50">
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
              "max-w-[85%]",
              message.sender === 'user' 
                ? "bg-primary text-white" 
                : "bg-white"
            )}>
              <CardContent className="p-4">
                {message.sender === 'agent' ? (
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
                
                {message.keyPoints && message.keyPoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold mb-1 text-primary flex items-center">
                      <Lightbulb className="h-3 w-3 mr-1" /> Key Points:
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      {message.keyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-2 text-primary">Follow-up Questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedQuestionClick(question)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs mt-2 opacity-70">
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