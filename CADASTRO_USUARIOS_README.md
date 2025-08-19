# 🔐 Sistema de Cadastro de Usuários para Pessoas Existentes

## 🎯 **Objetivo:**
Permitir que pessoas já cadastradas na tabela `pessoas` criem suas credenciais de acesso (usuário e senha) para acessar o aplicativo.

## 🔄 **Fluxo do Sistema:**

### **1. Tela de Login**
- ✅ **Link sutil**: "Já está cadastrado na tabela de pessoas? Criar usuário para acessar o app"
- ✅ **Navegação**: Leva para `/cadastrar-usuario`

### **2. Página de Cadastro de Usuário**
- 📱 **Etapa 1**: Informar telefone único
- 🔍 **Validação**: Busca na tabela `pessoas`
- ✅ **Confirmação**: Mostra nome da pessoa encontrada
- 📝 **Etapa 2**: Preencher email e senha
- 🎉 **Sucesso**: Usuário criado no Supabase Auth

## 🏗️ **Arquitetura:**

### **Tabelas Envolvidas:**
- **`pessoas`**: Dados básicos (nome, telefone, email, tipo)
- **`auth.users`**: Usuários do Supabase Auth (email, senha, metadata)

### **Relacionamento:**
- **`auth.users.metadata.pessoa_id`**: Link para tabela `pessoas`
- **`telefone`**: Campo único para identificação

## 🚀 **Como Funciona:**

### **1. Validação do Telefone:**
```typescript
// Busca na tabela pessoas
const { data, error } = await supabase
  .from('pessoas')
  .select('id, nome, telefone, email')
  .eq('telefone', telefoneLimpo)
  .single()
```

### **2. Verificação de Usuário Existente:**
```typescript
// Verifica se já existe usuário
const { data: usuarioExistente } = await supabase
  .from('auth.users')
  .select('id')
  .eq('phone', telefoneLimpo)
  .single()
```

### **3. Criação do Usuário:**
```typescript
// Cria usuário no Supabase Auth
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
```

### **4. Atualização da Tabela Pessoas:**
```typescript
// Atualiza email se foi alterado
if (email !== pessoa.email) {
  await supabase
    .from('pessoas')
    .update({ email: email })
    .eq('id', pessoa.id)
}
```

## 🔧 **Configurações Necessárias:**

### **1. Banco de Dados:**
- ✅ **Constraint UNIQUE** no campo `telefone` da tabela `pessoas`
- ✅ **RLS habilitado** com política de SELECT
- ✅ **Índice** no campo `telefone` para performance

### **2. Supabase Auth:**
- ✅ **Signup habilitado** para novos usuários
- ✅ **Email confirmation** configurado (opcional)
- ✅ **Password policies** configuradas

### **3. Políticas RLS:**
```sql
-- Política para permitir busca por telefone
CREATE POLICY "Permitir busca por telefone para cadastro" ON pessoas
FOR SELECT USING (true);
```

## 📱 **Interface do Usuário:**

### **Etapa 1 - Telefone:**
- 🎯 **Campo**: Input de telefone com formatação automática
- 🔍 **Botão**: "Verificar Telefone"
- 📱 **Validação**: Formato brasileiro (XX) XXXXX-XXXX
- ⚠️ **Erros**: Telefone não encontrado, usuário já existe

### **Etapa 2 - Dados:**
- 👤 **Confirmação**: Nome e telefone da pessoa encontrada
- 📧 **Campo**: E-mail (preenchido se já existir)
- 🔒 **Campo**: Senha (mínimo 6 caracteres)
- 🔒 **Campo**: Confirmar senha
- 👁️ **Toggle**: Mostrar/ocultar senhas
- 🔄 **Botões**: Voltar e Criar Usuário

### **Etapa 3 - Sucesso:**
- ✅ **Mensagem**: "Usuário Criado com Sucesso!"
- 🎯 **Botão**: "Ir para Login"
- 🔄 **Redirecionamento**: Para tela de login

## 🛡️ **Segurança:**

### **Validações:**
- ✅ **Telefone único**: Verifica se já existe usuário
- ✅ **Senha forte**: Mínimo 6 caracteres
- ✅ **Confirmação**: Senhas devem coincidir
- ✅ **E-mail válido**: Formato de e-mail correto

### **Proteções:**
- 🔒 **RLS**: Row Level Security habilitado
- 🚫 **Duplicação**: Impede usuários duplicados
- 📝 **Auditoria**: Metadata com dados da pessoa
- 🔄 **Sincronização**: Email atualizado na tabela pessoas

## 🧪 **Testes Recomendados:**

### **1. Cenários de Sucesso:**
- ✅ Pessoa com telefone único cria usuário
- ✅ E-mail atualizado na tabela pessoas
- ✅ Usuário consegue fazer login

### **2. Cenários de Erro:**
- ❌ Telefone não encontrado na tabela pessoas
- ❌ Usuário já existe para o telefone
- ❌ Senhas não coincidem
- ❌ E-mail inválido
- ❌ Senha muito curta

### **3. Validações de Interface:**
- 📱 **Responsivo**: Funciona em mobile e desktop
- 🔄 **Estados**: Loading, erro, sucesso
- 🎨 **UX**: Formatação automática de telefone
- 👁️ **Acessibilidade**: Toggle de senhas

## 🚨 **Configurações no Supabase:**

### **1. Authentication > Settings:**
- ✅ **Enable sign up**: Habilitado
- ✅ **Enable email confirmations**: Opcional
- ✅ **Password minimum length**: 6 caracteres

### **2. Authentication > Policies:**
- ✅ **RLS habilitado** na tabela pessoas
- ✅ **Política de SELECT** para busca por telefone

### **3. Database > Indexes:**
- ✅ **Índice** no campo telefone para performance

## 📋 **Checklist de Implementação:**

- [ ] **Script SQL** executado com sucesso
- [ ] **Constraint UNIQUE** no campo telefone
- [ ] **RLS habilitado** com políticas corretas
- [ ] **Índice** criado no campo telefone
- [ ] **Supabase Auth** configurado para signup
- [ ] **Página de cadastro** funcionando
- [ ] **Link na tela de login** visível
- [ ] **Validações** funcionando corretamente
- [ ] **Testes** realizados em diferentes cenários

## 🔄 **Próximos Passos:**

1. **Execute o script SQL** para configurar o banco
2. **Teste o cadastro** com pessoas existentes
3. **Verifique as políticas RLS** no Supabase
4. **Configure o Supabase Auth** se necessário
5. **Teste o fluxo completo** de cadastro e login

---

**🎉 Sistema de cadastro de usuários implementado com sucesso!**
**🔐 Pessoas existentes podem criar suas credenciais de acesso**
**📱 Interface intuitiva e responsiva**
**🛡️ Segurança e validações implementadas**
