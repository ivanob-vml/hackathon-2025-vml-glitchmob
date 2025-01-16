import React, { useState } from 'react';
import { MessageSquare, Send, ArrowRight, Bot } from 'lucide-react';
import ChatWithAgent from './components/ChatWithAgent';

type Message = {
  text: string;
  isBot: boolean;
};

function App() {
  // const [messages, setMessages] = useState<Message[]>([
  //   { text: "Hello Maam/Sir! I'm here to help you find the perfect product. How can I assist you today?", isBot: true }
  // ]);
  // const [input, setInput] = useState('');
  const [showProduct, setShowProduct] = useState(false);
  return <ChatWithAgent />;
  // const handleSend = () => {
  //   if (input.trim()) {
  //     setMessages([...messages, { text: input, isBot: false }]);
  //     // Simulate AI response
  //     setTimeout(() => {
  //       setMessages(prev => [...prev, {
  //         text: "Thank you for your message! I'm analyzing your request and will help you find the best solution.",
  //         isBot: true
  //       }]);
  //     }, 1000);
  //     setInput('');
  //   }
  // };

  
  
  if (showProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-96">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              alt="Product Hero"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium AI Assistant</h1>
            <p className="text-gray-600 mb-6">
              Experience the power of advanced artificial intelligence with our premium AI assistant.
              Designed to streamline your workflow and enhance productivity.
            </p>
            <button
              onClick={() => setShowProduct(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl h-[calc(100vh-4rem)]">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <Bot className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              </div>
              <button
                onClick={() => setShowProduct(true)}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span>View Product</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && (
                        <MessageSquare className="w-5 h-5 mt-1" />
                      )}
                      <p>{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;