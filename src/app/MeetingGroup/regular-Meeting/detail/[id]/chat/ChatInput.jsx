'use client';

import { useState } from 'react';

export default function ChatInput({ onSend }) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSend(input); // 부모 컴포넌트에서 전달받은 onSend 함수 호출
            setInput('');  // 입력창 초기화
        }
    };

    return (
        <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ddd' }}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your message"
                style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    marginRight: '10px',
                }}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                }}
            />
            <button
                onClick={handleSend}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                }}
            >
                Send
            </button>
        </div>
    );
}
