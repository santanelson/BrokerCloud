import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../stores/auth-store'
import { api } from '../api'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  
  useEffect(() => {
    if (!isAuthenticated) return
    const token = api.getAccessToken()
    if (!token) return

    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    const newSocket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      console.log('Connected to real-time chat server')
      setSocket(newSocket) // dispara re-render com o socket real
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from real-time chat server')
      setSocket(null)
    })

    socketRef.current = newSocket

    return () => {
      newSocket.disconnect()
      socketRef.current = null
      setSocket(null)
    }
  }, [isAuthenticated])

  return socket // agora reativo — força re-render quando conectar
}
