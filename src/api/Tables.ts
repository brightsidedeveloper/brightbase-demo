import { BrightBaseCRUD } from 'brightside-developer'
import { BrightTable } from '../types/bright.types'

export type IphoneMessages = BrightTable<'iphone_messages'>
export interface IphoneMessagesCreateOptions {
  OmitOnCreate: 'id' | 'created_at'
  OptionalOnCreate: never
}
export type IphoneMessagesReadOptions = Parameters<typeof Tables.iphone_messages.read>

export type IphonePostLikes = BrightTable<'iphone_post_likes'>
export interface IphonePostLikesCreateOptions {
  OmitOnCreate: 'id' | 'created_at'
  OptionalOnCreate: never
}
export type IphonePostLikesReadOptions = Parameters<typeof Tables.iphone_post_likes.read>

export type IphonePosts = BrightTable<'iphone_posts'>
export interface IphonePostsCreateOptions {
  OmitOnCreate: 'id' | 'created_at'
  OptionalOnCreate: never
}
export type IphonePostsReadOptions = Parameters<typeof Tables.iphone_posts.read>

export type Todos = BrightTable<'todos'>
export interface TodosCreateOptions {
  OmitOnCreate: 'id' | 'created_at'
  OptionalOnCreate: 'done'
}
export type TodosReadOptions = Parameters<typeof Tables.todos.read>

const Tables = {
  iphone_messages: new BrightBaseCRUD<IphoneMessages, IphoneMessagesCreateOptions>('iphone_messages'),
  iphone_post_likes: new BrightBaseCRUD<IphonePostLikes, IphonePostLikesCreateOptions>('iphone_post_likes'),
  iphone_posts: new BrightBaseCRUD<IphonePosts, IphonePostsCreateOptions>('iphone_posts'),
  todos: new BrightBaseCRUD<Todos, TodosCreateOptions>('todos')
}

export default Tables
