'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  UserRound,
  Phone,
  Mail,
  Plus,
  Pencil,
  Search,
  Filter,
  X,
  Users,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import RequireAdmin from '@/components/RequireAdmin'
import AdminLayout from '@/components/AdminLayout'
import { useSupabase } from '@/components/SupabaseProvider'

interface Pessoa {
  id: string
  nome: string
  telefone?: string
  email?: string
}

interface Evento {
  id: string
  nome: string
  data: string
}

export default function ListaPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [eventosSelecionados, setEventosSelecionados] = useState<string[]>([])
  const [participantesPorEvento, setParticipantesPorEvento] = useState<
    Record<string, number>
  >({})
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [mostrarFiltroAvancado, setMostrarFiltroAvancado] = useState(false)
  const { session } = useSupabase()

  useEffect(() => {
    const buscarEventos = async () => {
      const { data } = await supabase
        .from('eventos')
        .select('id, nome, data')
        .order('data', { ascending: false })
      if (data) setEventos(data)
    }

    buscarEventos()
  }, [])

  useEffect(() => {
    const buscarPessoas = async () => {
      if (eventosSelecionados.length > 0) {
        if (eventosSelecionados.includes('nenhum')) {
          // Pessoas que não participaram de nenhum evento
          const { data: checkinsData } = await supabase
            .from('checkins')
            .select('pessoa_id')

          const pessoasComCheckin = new Set(checkinsData?.map(c => c.pessoa_id))

          const { data, error } = await supabase
            .from('pessoas')
            .select('id, nome, telefone, email')
            .order('nome', { ascending: true })

          const filtradas = (data || [])
            .filter(p => !pessoasComCheckin.has(p.id))
            .filter(p => {
              const texto = `${p.nome} ${p.telefone} ${p.email}`.toLowerCase()
              return texto.includes(busca.toLowerCase())
            })

          setPessoas(filtradas)
          setParticipantesPorEvento({})
          return
        }

        // Pessoas que participaram dos eventos selecionados
        const { data, error } = await supabase
          .from('checkins')
          .select('evento_id, pessoa: pessoa_id (id, nome, telefone, email)')
          .in('evento_id', eventosSelecionados)


        if (error) {
          setErro('Erro ao buscar check-ins')
          return
        }

        const pessoasUnicas: Record<string, Pessoa> = {}
        const contagem: Record<string, Set<string>> = {}

        for (const c of data || []) {
          const p = Array.isArray(c.pessoa) ? c.pessoa[0] : c.pessoa
          if (p && p.id) {
            pessoasUnicas[p.id] = p
            contagem[c.evento_id] = contagem[c.evento_id] || new Set()
            contagem[c.evento_id].add(p.id)
          }
        }

        const filtradas = Object.values(pessoasUnicas).filter((p) => {
          const texto = `${p.nome} ${p.telefone} ${p.email}`.toLowerCase()
          return texto.includes(busca.toLowerCase())
        })

        const contagemFinal: Record<string, number> = {}
        for (const [eventoId, pessoasSet] of Object.entries(contagem)) {
          contagemFinal[eventoId] = pessoasSet.size
        }

        setParticipantesPorEvento(contagemFinal)
        setPessoas(filtradas)
      } else {
        let query = supabase
          .from('pessoas')
          .select('id, nome, telefone, email')
          .order('nome', { ascending: true })

        if (busca.trim() !== '') {
          query = query.or(
            `nome.ilike.%${busca}%,email.ilike.%${busca}%,telefone.ilike.%${busca}%`
          )
        }

        const { data, error } = await query

        if (error) setErro('Erro ao buscar pessoas')
        else setPessoas(data as Pessoa[])

        setParticipantesPorEvento({})
      }
    }

    buscarPessoas()
  }, [busca, eventosSelecionados])

  const handleSelecionarEventos = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value)
    setEventosSelecionados(values)
  }

  return (
    <RequireAdmin>
      <AdminLayout>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <UserRound className="w-5 h-5 text-blue-600" />
            Pessoas Cadastradas
          </h2>

          <Link
            href="/admin/pessoas/nova"
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Pessoa
          </Link>
        </div>

        {/* Busca + Filtro */}
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-sm"
            />
          </div>
          <button
            onClick={() => setMostrarFiltroAvancado((v) => !v)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
          >
            {mostrarFiltroAvancado ? <X size={16} /> : <Filter size={16} />}
          </button>
        </div>

        {/* Filtros Avançados */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            mostrarFiltroAvancado ? 'max-h-screen mb-6' : 'max-h-0'
          }`}
        >
          <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Participantes de quais eventos?
              </label>
              <select
                multiple
                value={eventosSelecionados}
                onChange={handleSelecionarEventos}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-48"
              >
                <option value="nenhum">Quem nunca participou de nenhum evento</option>
                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nome} ({new Date(evento.data).toLocaleDateString('pt-BR')})
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>

        {/* Totais por evento */}
        {eventosSelecionados.length > 0 && (
          <div className="mb-4 space-y-1">
            {eventos
              .filter((ev) => eventosSelecionados.includes(ev.id))
              .map((evento) => (
                <div
                  key={evento.id}
                  className="text-sm text-blue-800 bg-blue-100 px-3 py-2 rounded flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <strong>{evento.nome}</strong> —{' '}
                  {participantesPorEvento[evento.id] || 0} participante(s)
                </div>
              ))}
          </div>
        )}

        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        {/* Total de pessoas listadas */}
        <div className="mb-4 text-sm text-blue-800 bg-blue-100 px-4 py-2 rounded flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span><strong>Total:</strong> {pessoas.length} pessoa(s) listada(s)</span>
        </div>

        <ul className="grid gap-4">
          {pessoas.map((pessoa) => (
            <li
              key={pessoa.id}
              className="bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">{pessoa.nome}</h3>
                <Link
                  href={`/admin/pessoas/${pessoa.id}`}
                  className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </Link>
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {pessoa.telefone || 'Sem telefone'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {pessoa.email || 'Sem e-mail'}
              </p>
            </li>
          ))}
        </ul>
      </AdminLayout>
    </RequireAdmin>
  )
}
