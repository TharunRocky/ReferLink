import { useState, useEffect } from "react";
import "@/app/Chat.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MessageSquare, MapPin, Building2, DollarSign, Clock, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function GeneralChat({session, messages})  {
  const [activeRoom, setActiveRoom] = useState("general");
  const [newMessage, setNewMessage] = useState("");
  if(!session) return null;
  const username = session.user.name



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
        await fetch('/api/messages', {
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                room: 'general-Chat',
                username: username,
                message: newMessage
            }),
        });
       setNewMessage("");
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="discussion-page" data-testid="discussion-page">
      <div className="discussion-container">
        {/* <div className="discussion-header">
          <h1>Discussion Rooms</h1>
          <p>Connect with the community</p>
        </div> */}
  

            <Card className="chat-card">
              <CardHeader className="chat-header">
                <CardTitle>General Chat</CardTitle>
                <CardDescription>Casual conversations and general topics</CardDescription>
              </CardHeader>
              <CardContent className="chat-content">
                <div className="messages-container" data-testid="general-messages">
                  {(!messages || messages.length === 0) ? (
                    <div className="no-messages">
                      <MessageSquare size={48} className="no-messages-icon" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.timestamp} 
                        className={msg.username === username ? "message message-own" : "message message-other"}
                        data-testid={`message-${msg.id}`}
                      >
                        <div className="message-header">
                          <span className="message-username">{msg.username}</span>
                          <span className="message-time">{formatTime(msg.timestamp)}</span>
                        </div>
                        <div className="message-text">{msg.message}</div>
                      </div>
                    ))
                  )}
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
};
