'use client'

import { useEffect, useState } from 'react'
import ParticipanteLayout from '@/components/ParticipanteLayout'
import { Phone, Mail, MessageCircle } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  descricao: string
  telefone: string
  whatsapp: string
  email: string
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  useEffect(() => {
    // Dados fictícios para visualização
    setEmpresas([
      {
        id: '1',
        nome: 'Controle Pastoral',
        descricao: 'Especializada em software para gestão paroquial.',
        telefone: '41999990000',
        whatsapp: '41999990000',
        email: 'contato@controlepastoral.com',
      },
      {
        id: '2',
        nome: 'Vida Nova Contabilidade',
        descricao: 'Contabilidade com foco em instituições religiosas.',
        telefone: '41988887777',
        whatsapp: '41988887777',
        email: 'vida@nova.com',
      },
      {
        id: '3',
        nome: 'Zion Eventos',
        descricao: 'Organização de eventos religiosos e comunitários.',
        telefone: '41970001111',
        whatsapp: '41970001111',
        email: 'eventos@zion.com.br',
      },
      {
        id: '4',
        nome: 'Missão Web',
        descricao: 'Sites e apps para igrejas e pastorais.',
        telefone: '41995556666',
        whatsapp: '41995556666',
        email: 'contato@missao.com',
      },
      {
        id: '5',
        nome: 'Distribuidora Sagrada',
        descricao: 'Livros, bíblias e materiais litúrgicos.',
        telefone: '41999994444',
        whatsapp: '41999994444',
        email: 'sagrada@distribuidora.com',
      },
    ])
  }, [])

  return (
    <ParticipanteLayout>
      <h1 className="text-2xl font-bold text-gray-800  mb-6 text-center text-blue-800">Empresas Cadastradas</h1>

      <div className="grid gap-6">
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800  text-gray-800">{empresa.nome}</h2>
              <p className="text-gray-600 mt-1">{empresa.descricao}</p>

              <div className="mt-4 flex gap-2 flex-wrap">
                <a
                  href={`tel:${empresa.telefone}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
                >
                  <Phone size={16} /> 
                </a>
                <a
                  href={`https://wa.me/55${empresa.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
                >
                  <MessageCircle size={16} /> 
                </a>
                <a
                  href={`mailto:${empresa.email}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

            <div className="ml-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3v7m0 4h.01"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ParticipanteLayout>
  )
}
