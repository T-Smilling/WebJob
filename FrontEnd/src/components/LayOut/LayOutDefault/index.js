import Header from "./HeaderLayout";
import Footer from "./FooterLayout";
import Main from "./Main";
import React, { useState } from "react";
import { WechatOutlined } from '@ant-design/icons';
import ChatBot from '../../ChatBot/ChatBot';

function LayoutDefault(){
    const [showChat, setShowChat] = useState(false);
    return(
        <div className={`layout-default${showChat ? ' show-chatbot' : ''}`}>
            <Header/>
            <Main/>
            <Footer/>
            <div>
                <button
                  className="chatbot-float-btn"
                  onClick={() => setShowChat(s => !s)}
                  aria-label="Mở chat bot"
                >
                  <WechatOutlined style={{ fontSize: 32, color: '#0078ff' }} />
                </button>
                {showChat && <ChatBot onClose={() => setShowChat(false)} />}
            </div>
        </div>
    )
}

export default LayoutDefault;