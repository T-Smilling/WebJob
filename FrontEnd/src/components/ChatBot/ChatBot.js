import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatService } from '../../services/chatService';
import './ChatBot.css';
import logo from '../../logo.svg';
import { UserOutlined, RobotOutlined, CloseOutlined } from '@ant-design/icons';

const formatTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function removeScientificSalary(markdown) {
  // Nếu có (xxx VNĐ) thì chỉ giữ lại phần trong ngoặc, xóa toàn bộ phần trước
  let result = markdown.replace(/💰[^\(\n]*\(([^\)]+VNĐ)\)/g, '💰 $1');
  // Xử lý số khoa học không có ngoặc
  result = result.replace(/💰\s*([\d\.]+[eE]\d+)\s*VNĐ/g, (m, num) => {
    return '💰 ' + Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' VNĐ';
  });
  return result;
}

const SUGGESTED_QUESTIONS = [
  "Bắt đầu",
  "Hôm nay có gì công việc mới không",
  "Danh sách công việc lương cao nhất"
];

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Vui lòng chọn một trong các câu hỏi dưới đây để bắt đầu:', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuestion = async (question) => {
    const now = new Date();
    setMessages(msgs => ([...msgs, { from: 'user', text: question, time: now }]));
    setLoading(true);
    setError(null);
    try {
      const res = await chatService.sendMessage(question);
      const botMsg = res?.result?.response || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.';
      setMessages(msgs => ([...msgs, { from: 'bot', text: botMsg, time: new Date() }]));
      setStarted(true);
    } catch (e) {
      setError('Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date();
    setMessages([...messages, { from: 'user', text: input, time: now }]);
    setLoading(true);
    setError(null);
    try {
      const res = await chatService.sendMessage(input);
      const botMsg = res?.result?.response || 'Xin lỗi, tôi không hiểu yêu cầu của bạn.';
      setMessages(msgs => [...msgs, { from: 'bot', text: botMsg, time: new Date() }]);
    } catch (e) {
      setError('Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleClose = async () => {
    try {
      await chatService.clearChatHistory();
    } catch {}
    if (onClose) onClose();
  };

  useEffect(() => {
    return () => {
      chatService.clearChatHistory().catch(()=>{});
    };
  }, []);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <img src={logo} alt="ChatBot" className="chatbot-logo" />
        <span>AI ChatBot</span>
        {onClose && (
          <button className="chatbot-close-btn" onClick={handleClose} aria-label="Đóng chat bot">
            <CloseOutlined style={{ fontSize: 18 }} />
          </button>
        )}
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message chatbot-message--${msg.from}`}>
            <span className="chatbot-message-icon">
              {msg.from === 'user' ? <UserOutlined /> : <RobotOutlined />}
            </span>
            {msg.from === 'bot' ? (
              <span className="chatbot-message-text chatbot-message-markdown">
                <ReactMarkdown>{removeScientificSalary(msg.text)}</ReactMarkdown>
              </span>
            ) : (
              <span className="chatbot-message-text">{msg.text}</span>
            )}
            <span className="chatbot-message-time">{formatTime(msg.time)}</span>
          </div>
        ))}
        {loading && <div className="chatbot-message chatbot-message--bot chatbot-message--loading"><span className="chatbot-message-icon"><RobotOutlined /></span> <span className="chatbot-message-text">Đang trả lời...</span></div>}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="chatbot-error">{error}</div>}
      {!started && (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              className="chatbot-suggest-btn"
              onClick={() => handleSuggestedQuestion(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>
      )}
      {started && (
        <div className="chatbot-input-row">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>Gửi</button>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 