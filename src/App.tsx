import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <div className="min-h-dvh">
      <header className="p-4 border-b">Inventory Dashboard</header>
      <main className="p-6"><Outlet /></main>
    </div>
    </>
  )
}

export default App
