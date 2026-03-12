// app/chat/page.tsx
import { Suspense } from 'react';
import ChatContent from './ChatContent';

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold">Loading Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}