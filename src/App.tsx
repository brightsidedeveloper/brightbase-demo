import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { BrightBaseAuth, BrightBaseCRUD, BrightBaseRealtime, initBrightBase } from 'brightbase'
import { Loader2 } from 'lucide-react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
const auth = new BrightBaseAuth()

function Auth() {
  return <div />
}

// * CRUD
// TODO: Get Generic in class

const todos_table = new BrightBaseCRUD('todos')

function CRUD() {
  const queryClient = useQueryClient()

  const { data: todoList } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: () =>
      todos_table.read(
        {},
        {
          order: { by: 'created_at', ascending: false },
          limit: 3,
          offset: 1,
        }
      ),
  })

  const [text, setText] = useState('')

  const createTodo = useCallback(
    async () =>
      todos_table
        .create({ todo: text })
        .then(() => toast('Todo added!'))
        .then(() => setText(''))
        .then(() => queryClient.invalidateQueries({ queryKey: ['todos'] }))
        .catch((err) => toast.error(err.message)),
    [queryClient, text]
  )

  const updateTodo = useCallback(
    async (id: string, done: boolean) =>
      todos_table
        .update(id, { done })
        .then(() => toast('Todo updated!'))
        .then(() => queryClient.invalidateQueries({ queryKey: ['todos'] }))
        .catch((err) => toast.error(err.message)),
    [queryClient]
  )

  const deleteTodo = useCallback(
    async (id: string) =>
      todos_table
        .delete(id)
        .then(() => toast('Todo deleted!'))
        .then(() => queryClient.invalidateQueries({ queryKey: ['todos'] }))
        .catch((err) => toast.error(err.message)),
    [queryClient]
  )

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-6xl font-bold">Todo List</h1>
      <button onClick={() => queryClient.invalidateQueries({ queryKey: ['todos'] })}>asjhdkajshdkjsadhkj</button>
      <form
        className="flex mt-4"
        onSubmit={(e) => {
          e.preventDefault()
          createTodo()
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border border-gray-300 bg-zinc-900 rounded mr-2"
          placeholder={'Todo...'}
        />
        <button className="bg-blue-500 text-white p-2 rounded shadow-sm hover:shadow-lg hover:bg-blue-600 transition-all duration-300">
          Create
        </button>
      </form>
      <div />
      <div className=" flex flex-col gap-2 w-1/3">
        {todoList?.map(({ id, todo, done }: any) => (
          <div key={id} className="flex items-center justify-between w-full p-2 border border-gray-300 rounded">
            <div className="flex items-center">
              <input type="checkbox" checked={done} onChange={(e) => updateTodo(id, e.target.checked)} className="mr-2" />
              <span className={done ? 'line-through' : ''}>{todo}</span>
            </div>
            <button onClick={() => deleteTodo(id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// * REALTIME

interface GoatedEvents {
  message: { message: string; name: string }
  toggle: { isOn: boolean }
}

const listener = new BrightBaseRealtime<GoatedEvents>('goated')
const emitter = new BrightBaseRealtime<GoatedEvents>('goated')

function Realtime() {
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
          <button className="bg-blue-500 text-white p-2 rounded shadow-sm hover:shadow-lg hover:bg-blue-600 transition-all duration-300">
            {name ? 'Send' : 'Set Name'}
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center w-1/2">
        <button onClick={() => emitter.emit('toggle', { isOn: !toggle })}>{toggle ? 'On' : 'Off'}</button>
      </div>
    </div>
  )
}

// * STORAGE
