import { BrightBaseCRUD } from 'brightside-developer'
import { BrightTable } from '../types/bright.types'


export type Todo = BrightTable<'todos'>
export interface TodoCreateOptions {
  OmitOnCreate: 'id' | 'created_at'
  OptionalOnCreate: never
}
export type TodoReadOptions = Parameters<typeof Tables.todos.read>

const Tables = {
  todos: new BrightBaseCRUD<Todo, TodoCreateOptions>('todos'),
}

export default Tables
