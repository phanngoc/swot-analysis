"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toast: (message: string, variant?: "default" | "destructive" | "success") => void;
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
    variant?: "default" | "destructive" | "success"
  }[]>([])

  const toast = React.useCallback((message: string, variant: "default" | "destructive" | "success" = "default") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} variant={toast.variant} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function Toast({ message, variant }: { message: string, variant?: "default" | "destructive" | "success" }) {
  return (
    <div className={cn(
      "rounded-lg shadow-lg p-4 flex items-center gap-2 min-w-[200px] animate-in slide-in-from-bottom-5",
      {
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-white": variant === "default",
        "bg-red-500 dark:bg-red-700 text-white": variant === "destructive",
        "bg-green-500 dark:bg-green-700 text-white": variant === "success",
      }
    )}>
      <div className="flex-1">{message}</div>
      <X className="h-4 w-4 text-gray-400 cursor-pointer" />
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
