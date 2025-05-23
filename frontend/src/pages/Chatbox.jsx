import { useRef, useState, useEffect } from "react";
// ...other imports
import { URL } from "./constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Header from "../components/Header";
import StatusAdminHeader from "../components/StatusAdminHeader";

const API_URL = "http://localhost:3000/api";

function Chatbox() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [draftHistory, setDraftHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const [mode, setMode] = useState("chat");
  const [isFirstAcess, setIsFirstAcess] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setIsFirstAcess(false);

    const newUserMessage = { role: "user", parts: [{ text: question }] };
    const tempBotMessage = {
      role: "model",
      parts: [{ text: "Wait a minute..." }],
    };

    setHistory((prev) => [...prev, newUserMessage, tempBotMessage]);
    setQuestion("");

    try {
      let botText = "";
      if (mode === "chat") {
        const payload = { contents: [...history, newUserMessage] };
        let response = await fetch(URL, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        response = await response.json();
        botText = response.candidates[0].content.parts[0].text;
      } else if (mode === "data") {
        // Gửi tới backend để truy vấn dữ liệu MongoDB
        const response = await fetch(`${API_URL}/chatbox/getAnswer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        botText = await response.text();
      }

      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          parts: [{ text: botText }],
        };
        return updated;
      });
    } catch (err) {
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          parts: [{ text: "❌ An error occurred. Please try again." }],
        };
        return updated;
      });
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen pb-4">
        <StatusAdminHeader title="Chatbox" />
        <div className="flex-1 max-h-[80vh] overflow-y-auto">
          {isFirstAcess && (
            <div className="text-3xl font-bold font-raleway text-zinc-700 tracking-widest text-center pt-10">
              Welcome to the AI Chatbox!
            </div>
          )}
          <div className="prose max-w-none font-raleway space-y-4 py-4 px-20">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
    ${
      msg.role === "user"
        ? "max-w-xs md:max-w-md lg:max-w-xl bg-zinc-800 text-white rounded-br-none"
        : " md:max-w-3xl lg:max-w-4xl bg-gray-100 text-zinc-800 rounded-bl-none"
    }
    px-4 py-3 rounded-2xl
    whitespace-pre-wrap break-words
  `}
                >
                  {msg.role === "user" ? (
                    msg.parts[0].text
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        ul: (props) => (
                          <ul className="list-disc pl-6" {...props} />
                        ),
                        ol: (props) => (
                          <ol className="list-decimal pl-6" {...props} />
                        ),
                        code: (props) => (
                          <code className="bg-zinc-200 text-sm px-1 rounded">
                            {props.children}
                          </code>
                        ),
                        pre: (props) => (
                          <pre className="bg-zinc-800 text-white text-sm p-3 rounded overflow-x-auto">
                            {props.children}
                          </pre>
                        ),
                      }}
                    >
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => {
              setMode("chat");
              setHistory(draftHistory);
            }}
            className={`px-4 py-2 rounded-full cursor-pointer ${
              mode === "chat" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            Trò chuyện AI
          </button>
          <button
            onClick={() => {
              setMode("data");
              setDraftHistory(history);
              setHistory([]);
            }}
            className={`px-4 py-2 rounded-full cursor-pointer ${
              mode === "data" ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
          >
            Truy vấn dữ liệu
          </button>
        </div>

        <div className="bg-gray-200 w-1/2 p-1 text-black m-auto mt-4 rounded-4xl border border-gray-200 flex h-16">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-full p-3 outline-none bg-transparent"
            placeholder="Search"
          />
          <button
            className="rounded-full p-4 bg-zinc-700 text-white cursor-pointer hover:bg-zinc-500"
            onClick={askQuestion}
          >
            Ask
          </button>
        </div>
      </div>
    </>
  );
}

export default Chatbox;
