import { useState, useEffect, useRef } from "react";
import "@/app/Chat.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

export default function GeneralChat({ session, messages }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null); // ⬅ scroll anchor

  if (!session) return null;
  const username = session.user.name;

  // ✅ Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetch("/api/messages", {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: "general-Chat",
          username: username,
          message: newMessage,
        }),
      });

      setNewMessage("");
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message");
    }
  };

  // ✅ Updated: show **full date + time**
  const formatWhatsAppTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  // Older → show date without year
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};


  return (
    <div className="discussion-page" data-testid="discussion-page">
      <div className="discussion-container">
        <Card className="chat-card">
          <CardHeader className="chat-header">
            <CardTitle>General Chat</CardTitle>
            <CardDescription>Casual conversations and general topics</CardDescription>
          </CardHeader>

          <CardContent className="chat-content">
            <div className="messages-container" data-testid="general-messages">
              {!messages || messages.length === 0 ? (
                <div className="no-messages">
                  <MessageSquare size={48} className="no-messages-icon" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.timestamp}
                    className={
                      msg.username === username
                        ? "message message-own"
                        : "message message-other"
                    }
                    data-testid={`message-${msg.id}`}
                  >
                    <div className="message-header">
                      <span className="message-username">{msg.username}</span>
                      <span className="message-time">
                        {formatWhatsAppTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                ))
              )}

              {/* ⬅ auto-scroll anchor */}
              <div ref={messagesEndRef}></div>
            </div>
          </CardContent>

          <CardFooter className="chat-footer">
            <form onSubmit={handleSendMessage} className="message-form">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
                data-testid="general-message-input"
              />
              <Button type="submit" className="send-btn" data-testid="general-send-btn">
                <Send size={18} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
