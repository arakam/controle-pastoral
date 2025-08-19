-- Script para configurar o sistema de cadastro de usuários
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela pessoas existe e tem a estrutura correta
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'pessoas'
) as tabela_pessoas_existe;

-- 2. Verificar estrutura da tabela pessoas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pessoas' 
ORDER BY ordinal_position;

-- 3. Verificar se o campo telefone é único
SELECT 
  column_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'pessoas' 
  AND kcu.column_name = 'telefone'
  AND tc.constraint_type = 'UNIQUE';

-- 4. Criar constraint UNIQUE no telefone se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'pessoas' 
      AND kcu.column_name = 'telefone'
      AND tc.constraint_type = 'UNIQUE'
  ) THEN
    ALTER TABLE pessoas ADD CONSTRAINT pessoas_telefone_unique UNIQUE (telefone);
    RAISE NOTICE 'Constraint UNIQUE criada no campo telefone';
  ELSE
    RAISE NOTICE 'Constraint UNIQUE já existe no campo telefone';
  END IF;
END $$;

-- 5. Verificar políticas RLS da tabela pessoas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'pessoas';

-- 6. Criar política para permitir busca por telefone (para cadastro de usuários)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pessoas' 
    AND policyname = 'Permitir busca por telefone para cadastro'
  ) THEN
    CREATE POLICY "Permitir busca por telefone para cadastro" ON pessoas
    FOR SELECT USING (true);
    RAISE NOTICE 'Política para busca por telefone criada';
  ELSE
    RAISE NOTICE 'Política para busca por telefone já existe';
  END IF;
END $$;

-- 7. Verificar se a tabela pessoas tem RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename = 'pessoas';

-- 8. Habilitar RLS se não estiver habilitado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'pessoas' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE pessoas ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS habilitado na tabela pessoas';
  ELSE
    RAISE NOTICE 'RLS já está habilitado na tabela pessoas';
  END IF;
END $$;

-- 9. Verificar se existe índice no campo telefone para performance
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'pessoas' 
  AND indexdef LIKE '%telefone%';

-- 10. Criar índice no campo telefone se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'pessoas' 
      AND indexdef LIKE '%telefone%'
  ) THEN
    CREATE INDEX idx_pessoas_telefone ON pessoas (telefone);
    RAISE NOTICE 'Índice criado no campo telefone';
  ELSE
    RAISE NOTICE 'Índice no campo telefone já existe';
  END IF;
END $$;

-- 11. Verificar dados de exemplo na tabela pessoas
SELECT COUNT(*) as total_pessoas FROM pessoas;

-- 12. Mostrar algumas pessoas para teste
SELECT id, nome, telefone, email, tipo 
FROM pessoas 
LIMIT 5;

-- 13. Verificar se há telefones duplicados
SELECT telefone, COUNT(*) as quantidade
FROM pessoas 
GROUP BY telefone 
HAVING COUNT(*) > 1;

-- 14. Verificar configurações do Supabase Auth
-- (Estas configurações devem ser feitas no painel do Supabase)

-- 15. Resumo das configurações necessárias
SELECT 
  'Configurações para Cadastro de Usuários' as titulo,
  '1. Tabela pessoas com campo telefone UNIQUE' as item1,
  '2. RLS habilitado com política de SELECT' as item2,
  '3. Índice no campo telefone para performance' as item3,
  '4. Campo email opcional para atualização' as item4,
  '5. Supabase Auth configurado para signup' as item5;
