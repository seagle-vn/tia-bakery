import ChatBot from '@/components/ChatBot';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our Business
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI assistant can help answer questions about our services, pricing, and policies. 
            Try asking something!
          </p>
        </div>
        <ChatBot />
      </div>
    </main>
  );
} 