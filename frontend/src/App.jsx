import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "sonner"
import ErrorBoundary from "@/components/ErrorBoundary.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Pages />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 