import { BrightBaseRealtime, initBrightBase } from 'brightbase'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

initBrightBase(SUPABASE_URL, SUPABASE_ANON_KEY)

interface GoatedEvents {
  message: { message: string; name: string }
  toggle: { isOn: boolean }
}

const listener = new BrightBaseRealtime<GoatedEvents>('goated')
const emitter = new BrightBaseRealtime<GoatedEvents>('goated')

export default function App() {
  const [name, setName] = useState('')
  const [toggle, setToggle] = useState(false)
  const [messages, setMessages] = useState<GoatedEvents['message'][]>([])
  const [text, setText] = useState('')

  const handleSend = useCallback(async () => {
    if (!text.trim()) return
    if (!name) setName(text)
    else emitter.emit('message', { message: text, name })
    setText('') // Clear the input after sending
  }, [name, text])

  useEffect(() => listener.subscribe(), [])
  useEffect(
    () =>
      listener.on('message', (payload) => {
        if (payload.name !== name)
          toast(`${payload.name}: ${payload.message}`, {
            icon: '🔔',
            style: { background: 'var(--background)', color: 'var(--text)', border: '1px solid black' },
          })
        setMessages((prev) => [...prev, payload])
      }),
    [name]
  )
  useEffect(() => listener.on('toggle', (payload: { isOn: boolean }) => setToggle(payload.isOn)), [])

  return (
    <div className="flex h-screen p-4">
      <div className="flex flex-col w-1/2">
        <div className="flex-1 overflow-y-auto flex flex-col-reverse bg-zinc-900 p-4 rounded">
          <div>
            {messages.map(({ message, name }, i) => (
              <div key={i} className="bg-blue-500 text-white p-2 my-2 rounded">
                <span className="font-semibold">{name}: </span>
                {message}
              </div>
            ))}
          </div>
        </div>
        <form
          className="flex mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border border-gray-300 bg-zinc-900 rounded mr-2"
            placeholder={name ? 'Type a message...' : 'Set your name...'}
          />
          <button className="bg-blue-500 text-white p-2 rounded">{name ? 'Send' : 'Set Name'}</button>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center w-1/2">
        <button onClick={() => emitter.emit('toggle', { isOn: !toggle })}>{toggle ? 'On' : 'Off'}</button>
      </div>
    </div>
  )
}
