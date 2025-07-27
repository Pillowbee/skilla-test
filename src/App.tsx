import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "@/utils/queryClient"
import CallsTable from "@/components/CallsTable/CallsTable.tsx"
import styles from './App.module.css'

window.__TANSTACK_QUERY_CLIENT__ = queryClient

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <CallsTable />
      </div>
    </QueryClientProvider>
  )
}

export default App
