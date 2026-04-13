import { useSSEChat } from '@/hooks/use-sse-chat';
import { useAISettings } from '@/contexts/ai-settings';

export function useAISSEChat() {
  const { settings, activeKey } = useAISettings();
  return useSSEChat({
    provider: settings.provider,
    apiKey: activeKey,
  });
}
