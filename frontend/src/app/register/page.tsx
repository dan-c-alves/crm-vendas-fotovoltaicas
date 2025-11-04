"use client"
// Página descontinuada: redireciona para a página inicial (login com Google)
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [router])
  return null
}
