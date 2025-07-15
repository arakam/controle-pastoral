'use client'

import { useEffect, useState } from 'react'
import { Calendar, Lightbulb, ShoppingCart, Home, Users, User } from 'lucide-react'
import { useSupabase } from '@/components/SupabaseProvider'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import Link from 'next/link'

export default function DashboardParticipante() {
  const { supabase, session } = useSupabase()
  const [eventoProximo, setEventoProximo] = useState<any>(null)

  useEffect(() => {
    const carregarProximoEvento = async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .gte('data', new Date().toISOString())
        .order('data', { ascending: true })
        .limit(1)
        .single()

      if (!error && data) setEventoProximo(data)
    }

    carregarProximoEvento()
  }, [supabase])

  return (
    <ParticipanteLayout>
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Providência Empreendedora</h1>
          <p className="text-sm italic text-gray-600">
            "Onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles." – Mt 18:20
          </p>
        </div>

        <div className="bg-blue-600 text-white text-center rounded-lg py-3 shadow-md font-semibold">
          <Link href="/checkin">Fazer check-in</Link>
        </div>

        <div className="grid grid-cols-3 text-center gap-4 text-sm text-gray-700">
          <Link href="/participante/eventos" className="flex flex-col items-center">
            <Calendar className="w-5 h-5 mb-1" />
            Encontros
          </Link>
          <Link href="/participante/dicas" className="flex flex-col items-center">
            <Lightbulb className="w-5 h-5 mb-1" />
            Dicas
          </Link>
          <Link href="/participante/empresas" className="flex flex-col items-center">
            <ShoppingCart className="w-5 h-5 mb-1" />
            Compre do Irmão
          </Link>
        </div>

        {eventoProximo && (
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm text-gray-500 mb-1">Próximo Encontro</h2>
            <div className="text-md font-semibold">{eventoProximo.nome}</div>
            <div className="text-sm text-gray-600">
              {new Date(eventoProximo.data).toLocaleDateString('pt-BR')} - {eventoProximo.local}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Dicas por Tema</h2>
          <ul className="space-y-2 text-sm text-blue-700">
            <li><Link href="/participante/dicas?tema=financas">💰 Finanças</Link></li>
            <li><Link href="/participante/dicas?tema=vendas">📈 Vendas</Link></li>
            <li><Link href="/participante/dicas?tema=redes-sociais"># Redes Sociais</Link></li>
          </ul>
        </div>
      </div>

      {/* Menu inferior (PWA) */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t flex justify-around py-2 text-xs text-gray-600">
        <Link href="/participante" className="flex flex-col items-center">
          <Home className="w-5 h-5" /> Início
        </Link>
        <Link href="/participante/eventos" className="flex flex-col items-center">
          <Calendar className="w-5 h-5" /> Encontro
        </Link>
        <Link href="/participante/empresas" className="flex flex-col items-center">
          <Users className="w-5 h-5" /> Comunidade
        </Link>
        <Link href="/participante/perfil" className="flex flex-col items-center">
          <User className="w-5 h-5" /> Perfil
        </Link>
      </div>
    </ParticipanteLayout>
  )
}
