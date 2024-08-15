import { useCallback, useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState<string[]>([])
  const [text, setText] = useState('')

  const handleSend = useCallback(async () => {
    console.log('Sending message:', text)
    setText('')
  }, [text])

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto flex flex-col-reverse bg-zinc-900 p-4 rounded">
        <div>
          {messages.map((msg, i) => (
            <div key={i} className="bg-blue-500 text-white p-2 my-2 rounded">
              {msg}
            </div>
          ))}
        </div>
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border border-gray-300 bg-zinc-900 rounded mr-2"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  )
}
