'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useSupabase } from '@/components/SupabaseProvider'

interface Pessoa {
  id: string
  nome: string
  telefone: string
  email?: string
}

export default function CadastrarUsuario() {
  const router = useRouter()
  const { supabase } = useSupabase()
  
  const [telefone, setTelefone] = useState('')
  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
  
  const [etapa, setEtapa] = useState<'telefone' | 'dados' | 'sucesso'>('telefone')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscarPessoa = async () => {
    if (!telefone.trim()) {
      setErro('Por favor, informe o número de telefone')
      return
    }

    setCarregando(true)
    setErro(null)

    try {
      // Limpar formatação do telefone para busca
      const telefoneLimpo = telefone.replace(/\D/g, '')
      
      const { data, error } = await supabase
        .from('pessoas')
        .select('id, nome, telefone, email')
        .eq('telefone', telefoneLimpo)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setErro('Telefone não encontrado. Verifique se você está cadastrado na tabela de pessoas.')
        } else {
          setErro(`Erro ao buscar pessoa: ${error.message}`)
        }
        return
      }

      // Verificar se já existe usuário para esta pessoa
      const { data: usuarioExistente } = await supabase
        .from('auth.users')
        .select('id')
        .eq('phone', telefoneLimpo)
        .single()

      if (usuarioExistente) {
        setErro('Já existe um usuário cadastrado com este telefone. Faça login ou recupere sua senha.')
        return
      }

      setPessoa(data)
      setEmail(data.email || '')
      setEtapa('dados')
      
    } catch (err) {
      console.error('Erro ao buscar pessoa:', err)
      setErro('Erro inesperado ao buscar pessoa. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const criarUsuario = async () => {
    if (!pessoa) return

    // Validações
    if (!email.trim()) {
      setErro('E-mail é obrigatório')
      return
    }

    if (!senha.trim()) {
      setErro('Senha é obrigatória')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }

    setCarregando(true)
    setErro(null)

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            pessoa_id: pessoa.id,
            nome: pessoa.nome,
            telefone: pessoa.telefone
          }
        }
      })

      if (authError) {
        setErro(`Erro ao criar usuário: ${authError.message}`)
        return
      }

      // Atualizar email na tabela pessoas se foi alterado
      if (email !== pessoa.email) {
        const { error: updateError } = await supabase
          .from('pessoas')
          .update({ email: email })
          .eq('id', pessoa.id)

        if (updateError) {
          console.warn('Erro ao atualizar email na tabela pessoas:', updateError)
        }
      }

      setEtapa('sucesso')
      
    } catch (err) {
      console.error('Erro ao criar usuário:', err)
      setErro('Erro inesperado ao criar usuário. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarTelefone(e.target.value)
    setTelefone(formatted)
  }

  const voltarParaTelefone = () => {
    setEtapa('telefone')
    setPessoa(null)
    setEmail('')
    setSenha('')
    setConfirmarSenha('')
    setErro(null)
  }

  if (etapa === 'sucesso') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Usuário Criado com Sucesso!</h1>
          <p className="text-gray-600 mb-6">
            Sua conta foi criada e você já pode fazer login no aplicativo.
          </p>
          
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {etapa === 'telefone' ? 'Cadastrar Usuário' : 'Completar Cadastro'}
          </h1>
          <p className="text-gray-600">
            {etapa === 'telefone' 
              ? 'Informe seu telefone para verificar se você está cadastrado'
              : `Olá, ${pessoa?.nome}! Complete seus dados para criar o usuário`
            }
          </p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-800 text-sm">{erro}</p>
          </div>
        )}

        {etapa === 'telefone' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  placeholder="(11) 99999-9999"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={carregando}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite apenas números, a formatação será aplicada automaticamente
              </p>
            </div>

            <button
              onClick={buscarPessoa}
              disabled={carregando || !telefone.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Verificar Telefone
                </>
              )}
            </button>

            <div className="text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Voltar para Login
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{pessoa?.nome}</p>
                  <p className="text-sm text-blue-700">{pessoa?.telefone}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={carregando}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={carregando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={mostrarConfirmarSenha ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite a senha novamente"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={carregando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarConfirmarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={voltarParaTelefone}
                disabled={carregando}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Voltar
              </button>
              
              <button
                onClick={criarUsuario}
                disabled={carregando || !email.trim() || !senha.trim() || !confirmarSenha.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {carregando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Criar Usuário
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
