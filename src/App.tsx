import { Loader2, Trash } from 'lucide-react'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import useCreateQuery from './hooks/useCreateQuery'
import useInvalidateQuery from './hooks/useInvalidateQuery'
import { BrightBaseCRUD, BrightBaseRealtime, initBrightBase, useSuspenseQuery, wetToast } from 'brightside-developer'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

initBrightBase(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function App() {
  const [page, setPage] = useState('')

  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="size-14 animate-spin" />
        </div>
      }
    >
      {page === 'realtime' ? <Realtime /> : page === 'crud' ? <CRUD /> : <Auth />}
      <div className="fixed z-10 top-4 right-4 flex flex-col gap-4 items-end">
        <button onClick={() => setPage('auth')}>Auth</button>
        <button onClick={() => setPage('crud')}>CRUD</button>
        <button onClick={() => setPage('realtime')}>Realtime</button>
        <button onClick={() => setPage('storage')}>Storage</button>
      </div>
    </Suspense>
  )
}

// * AUTH
// TODO: Get SETUP
// const auth = new BrightBaseAuth()

function Auth() {
  return <div />
}

// * CRUD
interface Todo {
  id: string
  created_at: string
  todo: string
  done: boolean
}

interface CreateOptions {
  OmitOnCreate: 'id' | 'created_at'
  OptionalOnCreate: 'done'
}

const todos_table = new BrightBaseCRUD<Todo, CreateOptions>('todos')

const ReadOptions: Parameters<typeof todos_table.read> = [
  {},
  {
    order: { by: 'created_at', ascending: false },
  },
]

function CRUD() {
  const query = useCreateQuery(todos_table, ReadOptions)

  const invalidate = useInvalidateQuery(query)

  const { data: todoList } = useSuspenseQuery(query)

  // ? React Hook Form ? //
  const [text, setText] = useState('')

  const createTodo = useCallback(
    async () =>
      todos_table
        .create({ todo: text })
        .then(() => {
          invalidate()
          setText('')
          wetToast('Todo added!', { icon: '🎉' })
        })
        .catch((err) => wetToast(err.message, { icon: '❌' })),
    [invalidate, text]
  )

  const updateTodo = useCallback(
    async ({ id, done, todo: label }: Todo) =>
      todos_table
        .update(id, { done })
        .then(() => {
          invalidate()
          wetToast(`${label} ${done ? 'checked' : 'unchecked'}!`, { icon: '🎉' })
        })
        .catch((err) => wetToast(err.message, { icon: '❌' })),
    [invalidate]
  )

  const deleteTodo = useCallback(
    async ({ id }: Todo) =>
      todos_table
        .delete(id)
        .then(() => {
          invalidate()
          wetToast('Todo deleted!', { icon: '🎉' })
        })
        .catch((err) => wetToast(err.message, { icon: '❌' })),
    [invalidate]
  )

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-[20rem]">
        <h1 className="text-6xl font-bold">Todo List</h1>
        <form
          className="flex gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault()
            createTodo()
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-2 border border-gray-300 bg-zinc-900 rounded w-full"
            placeholder={'Todo...'}
          />
          <button className="bg-blue-500 text-white p-2 rounded shadow-sm hover:shadow-lg hover:bg-blue-600 transition-all duration-300">
            Create
          </button>
        </form>
        <div />
        <div className=" flex flex-col gap-2 w-full">
          {todoList?.map((t) => {
            const { id, todo, done } = t
            return (
              <div key={id} className="flex items-center justify-between w-full p-2 border border-gray-300 rounded">
                <div className="flex items-center">
                  <input type="checkbox" checked={done} onChange={(e) => updateTodo({ ...t, done: e.target.checked })} className="mr-2" />
                  <span className={done ? 'line-through' : ''}>{todo}</span>
                </div>
                <button onClick={() => deleteTodo(t)}>
                  <Trash className="size-5 text-red-500 hover:text-red-700 transition-colors duration-300" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// * REALTIME
interface DemoEvents {
  message: { message: string; name: string }
  toggle: { isOn: boolean }
}

type DemoEventCallback<T extends keyof DemoEvents> = (payload: DemoEvents[T]) => void
// I use one channel to emit and another to listen
// This is because I want to receive my own broadcasts
// Sometimes you may not want to receive your own broadcasts
const channel1 = new BrightBaseRealtime<DemoEvents>('room1')
const channel2 = new BrightBaseRealtime<DemoEvents>('room1')

const Listener = {
  useSubscribe() {
    useEffect(() => channel1.subscribe(), [])
  },
  useMessage(cb: DemoEventCallback<'message'>) {
    const cbRef = useRef(cb)
    cbRef.current = cb
    useEffect(() => channel1.on('message', cbRef.current), [])
  },
  useToggle(cb: DemoEventCallback<'toggle'>) {
    const cbRef = useRef(cb)
    cbRef.current = cb
    useEffect(() => channel1.on('toggle', cbRef.current), [])
  },
}

const Emitter = {
  message: function emitMessage(payload: DemoEvents['message']) {
    channel2.emit('message', payload)
  },
  toggle: function emitToggle(payload: DemoEvents['toggle']) {
    channel2.emit('toggle', payload)
  },
}

function Realtime() {
  const [name, setName] = useState('')
  const [toggle, setToggle] = useState(false)
  const [messages, setMessages] = useState<DemoEvents['message'][]>([])
  const [text, setText] = useState('')

  const handleSend = useCallback(async () => {
    if (!text.trim()) return
    if (!name) setName(text)
    else Emitter.message({ message: text, name })
    setText('') // Clear the input after sending
  }, [name, text])

  const handleToggle = useCallback(() => Emitter.toggle({ isOn: !toggle }), [toggle])

  Listener.useSubscribe()

  Listener.useToggle(({ isOn }) => setToggle(isOn))

  Listener.useMessage((msg) => {
    setMessages((prev) => [...prev, msg])
    if (msg.name === name) return
    wetToast(`${msg.name}: ${msg.message}`, {
      icon: '🔔',
    })
  })

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

// * STORAGE
