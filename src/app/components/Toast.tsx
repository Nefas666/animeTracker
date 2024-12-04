import React, { useState, useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className={`absolute top-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-[#bef96a]' : 'bg-[#f9836a]'} text-white`}>
      {message}
    </div>
  )
}

export default Toast

