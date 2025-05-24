"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = React.createContext<{
  toast: (message: string) => void;
}>({
  toast: () => {},
})

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<{
    id: number
    message: string
  }[]>([])

  const toast = React.useCallback((message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastProvider.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} />
        ))}
      </div>
    </ToastProvider.Provider>
  )
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-2 min-w-[200px] animate-in slide-in-from-bottom-5">
      <div className="flex-1">{message}</div>
      <X className="h-4 w-4 text-gray-400 cursor-pointer" />
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastProvider)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
