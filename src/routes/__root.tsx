import { createRootRoute, Outlet } from '@tanstack/react-router'
import { BrightQueryDevTools } from 'brightside-developer'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <BrightQueryDevTools />
    </>
  ),
})
