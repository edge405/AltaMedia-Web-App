import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "sonner"
import ErrorBoundary from "@/components/ErrorBoundary.jsx"

function App() {
  return (
    <ErrorBoundary>
      <Pages />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  )
}

export default App 