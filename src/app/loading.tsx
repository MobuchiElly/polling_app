import React from 'react'

const loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center fixed inset-0 z-60 bg-white/50">
      <div className="h-16 w-16 border-4 border-blue-500 rounded-full border-t-0 animate-spin flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-blue-300 rounded-full border-b-0 animate-spin"></div>
      </div>
    </div>
  )
}

export default loading