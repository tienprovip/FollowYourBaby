import React from 'react';
import { Text, View } from 'react-native';
import RiskBadge from '@/components/ui/RiskBadge';
import type { ChatMessage } from '@/hooks/useAIChat';

interface ChatBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function ChatBubble({ message, isUser }: ChatBubbleProps) {
  if (isUser) {
    return (
      <View className="items-end mb-3 px-4">
        <View className="bg-brand-pink-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
          <Text className="text-brand-navy text-sm leading-6">{message.content}</Text>
        </View>
        <Text className="text-xs text-gray-400 mt-1 mr-1">{formatTime(message.created_at)}</Text>
      </View>
    );
  }

  return (
    <View className="items-start mb-3 px-4">
      <View className="bg-white border border-brand-gray rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-brand">
        {message.risk_level && message.risk_level !== 'green' && (
          <View className="mb-2">
            <RiskBadge risk_level={message.risk_level} />
          </View>
        )}
        <Text className="text-brand-navy text-sm leading-6">{message.content}</Text>
        {message.risk_level === 'yellow' && (
          <Text className="text-amber-600 text-xs mt-2 font-medium">
            Theo dõi thêm tình trạng này.
          </Text>
        )}
        {message.risk_level === 'red' && (
          <Text className="text-red-600 text-xs mt-2 font-medium">
            Nên liên hệ bác sĩ sớm.
          </Text>
        )}
      </View>
      <Text className="text-xs text-gray-400 mt-1 ml-1">{formatTime(message.created_at)}</Text>
    </View>
  );
}

export default ChatBubble;
