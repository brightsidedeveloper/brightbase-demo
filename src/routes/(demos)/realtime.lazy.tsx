import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { BrightBaseRealtime, wetToast } from 'brightside-developer'
import { useCallback, useState } from 'react'
import useEvent from '../../hooks/BrightBaseRealtime/useEvent'
import { RealtimeEvents } from '../../api/Channels'
import useSubscribe from '../../hooks/BrightBaseRealtime/useSubscribe'

export const Route = createLazyFileRoute('/(demos)/realtime')({
  component: Realtime,
})

interface DemoEvents extends RealtimeEvents {
  message: { message: string; name: string }
  toggle: { isOn: boolean }
}

// I use one channel to emit and another to listen
// This is because I want to receive my own broadcasts
// Sometimes you may not want to receive your own broadcasts
const channel1 = new BrightBaseRealtime<DemoEvents>('room1')
const channel2 = new BrightBaseRealtime<DemoEvents>('room1')

function Realtime() {
  const [name, setName] = useState('')
  const [toggle, setToggle] = useState(false)
  const [messages, setMessages] = useState<DemoEvents['message'][]>([])
  const [text, setText] = useState('')

  const handleSend = useCallback(async () => {
    if (!text.trim()) return
    if (!name) setName(text)
    else channel2.emit('message', { message: text, name })
    setText('') // Clear the input after sending
  }, [name, text])

  const handleToggle = useCallback(() => channel2.emit('toggle', { isOn: !toggle }), [toggle])

  useSubscribe(channel1)

  useEvent(channel1, 'toggle', ({ isOn }) => setToggle(isOn))

  useEvent(channel1, 'message', (msg) => {
    setMessages((prev) => [...prev, msg])
    if (msg.name === name) return
    wetToast(`${msg.name}: ${msg.message}`, {
      icon: '🔔',
    })
  })

  return (
    <div className="flex h-screen p-4">
      <Link to="/" className="block p-2 bg-blue-500 text-white rounded fixed z-10 top-4 right-4 text-3xl">
        Back
      </Link>
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
          <button className="bg-blue-500 text-white p-2 rounded shadow-sm hover:shadow-lg hover:bg-blue-600 transition-all duration-300">
            {name ? 'Send' : 'Set Name'}
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center w-1/2">
        <button onClick={handleToggle}>{toggle ? 'On' : 'Off'}</button>
      </div>
    </div>
  )
}
