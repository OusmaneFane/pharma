import { useForm } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePage } from '@inertiajs/react';
import type { Message as MessageType } from '@/types';

interface OrderChatProps {
  messages: MessageType[];
  postUrl: string;
  /** When true, show the chat (e.g. only when order has chosen offer). */
  show?: boolean;
}

export function OrderChat({ messages, postUrl, show = true }: OrderChatProps) {
  const authUser = (usePage().props as { auth?: { user?: { id: number } } }).auth?.user;
  const currentUserId = authUser?.id ?? 0;

  const { data, setData, post, processing, reset, errors } = useForm({
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.content.trim()) return;
    post(postUrl, {
      preserveScroll: true,
      onSuccess: () => reset('content'),
    });
  };

  if (!show) return null;

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="size-4" />
          Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3">
          {messages.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Aucun message. Échangez avec la pharmacie / le client ici.
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      isMe
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {!isMe && msg.sender?.name && (
                      <p className="mb-0.5 text-xs font-medium opacity-90">
                        {msg.sender.name}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${isMe ? 'opacity-80' : 'text-muted-foreground'}`}
                    >
                      {new Date(msg.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Votre message…"
            value={data.content}
            onChange={(e) => setData('content', e.target.value)}
            maxLength={2000}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={processing || !data.content.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </CardContent>
    </Card>
  );
}
