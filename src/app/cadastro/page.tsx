'use client'

import dynamic from 'next/dynamic'

// Importa dinamicamente o componente de cadastro como client component
const CadastroForm = dynamic(() => import('@/components/CadastroForm'), {
  ssr: false,
})

export default function Page() {
  return <CadastroForm />
}
