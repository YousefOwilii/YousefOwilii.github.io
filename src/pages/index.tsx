import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the app directory page
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">Loading...</h1>
        <p className="mt-4 text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
} 