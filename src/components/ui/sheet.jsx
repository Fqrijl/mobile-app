import React from 'react'
import { X } from 'lucide-react'

export function Sheet({ children, open, onOpenChange }) {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg bg-white shadow-lg">
        {children}
      </div>
    </div>
  )
}

export function SheetContent({ children, className = '' }) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {children}
    </div>
  )
}

export function SheetHeader({ children, className = '' }) {
  return (
    <div className={`p-4 border-b ${className}`}>
      {children}
    </div>
  )
}

export function SheetTitle({ children, className = '' }) {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  )
}

export function SheetTrigger({ children, onClick }) {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}

export function SheetClose({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  )
}

