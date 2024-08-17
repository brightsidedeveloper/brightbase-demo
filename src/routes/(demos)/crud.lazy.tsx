import { createLazyFileRoute, Link } from '@tanstack/react-router'
import useCreateQuery from '../../hooks/BrightBaseQuery/useCreateQuery'
import { BrightQuery, wetToast } from 'brightside-developer'
import { Suspense, useCallback, useState } from 'react'
import Tables, { Todos, TodosReadOptions } from '../../api/Tables'
import { Loader2, Trash } from 'lucide-react'
import useInvalidateQuery from '../../hooks/BrightBaseQuery/useInvalidateQuery'

export const Route = createLazyFileRoute('/(demos)/crud')({
  component: () => (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="size-14 animate-spin" />
        </div>
      }
    >
      <CRUD />
    </Suspense>
  ),
})

const ReadOptions: TodosReadOptions = [
  {},
  {
    order: { by: 'created_at', ascending: false },
  },
]

function CRUD() {
  const query = useCreateQuery(Tables.todos, ReadOptions)

  const invalidate = useInvalidateQuery(query)

  const { data: todoList } = BrightQuery.useSuspenseQuery(query)

  // ? React Hook Form ? //
  const [text, setText] = useState('')

  const createTodo = useCallback(
    async () =>
      Tables.todos
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
    async ({ id, done, todo: label }: Todos) =>
      Tables.todos
        .update(id, { done })
        .then(() => {
          invalidate()
          wetToast(`${label} ${done ? 'checked' : 'unchecked'}!`, { icon: '🎉' })
        })
        .catch((err) => wetToast(err.message, { icon: '❌' })),
    [invalidate]
  )

  const deleteTodo = useCallback(
    async ({ id }: Todos) =>
      Tables.todos
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
      <Link to="/" className="block p-2 bg-blue-500 text-white rounded fixed z-10 top-4 right-4 text-3xl">
        Back
      </Link>
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
