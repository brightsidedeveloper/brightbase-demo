import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(demos)/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>This is a demo page. You can navigate to other pages by clicking the links.</p>
      <Link to="/crud" className="block p-2 bg-blue-500 text-white rounded mt-2">
        CRUD
      </Link>
      <Link to="/realtime" className="block p-2 bg-blue-500 text-white rounded mt-2">
        Realtime
      </Link>
    </div>
  )
}
