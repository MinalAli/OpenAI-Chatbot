'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('@/components/ChatInterface'), {
  ssr: false,
  loading: () => <p>Loading chat...</p>,
});

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('user');
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {user && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      )}
      <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/logo.png" alt="Logo" width={500} height={250} />
        <h1 className="text-4xl font-bold mt-8 mb-4">Your AI-Powered Interview Support Assistant</h1>
        <p className="text-xl mb-8">Click on the icon to start chat</p>
        <div className="animate-bounce">
        <svg

className="w-12 h-12 text-indigo-500"

fill="none"

strokeLinecap="round"

strokeLinejoin="round"

strokeWidth="2"

viewBox="0 0 24 24"

stroke="currentColor"

>

<path d="M4 4c5 10 15 0 15 15" />

<path d="M17 19l4 0 0 -4" />

</svg>
        </div>
      </div>
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full cursor-pointer"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </button>
      )}
      {isChatOpen && user && (
        <ChatInterface user={user} onClose={toggleChat} />
      )}
    </div>
  );
};

export default MainPage;