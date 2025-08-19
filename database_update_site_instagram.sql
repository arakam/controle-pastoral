-- Script para adicionar campos site e instagram na tabela empresas
-- Execute este script no SQL Editor do Supabase

-- Adicionar campo site
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS site TEXT;

-- Adicionar campo instagram  
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS instagram TEXT;

-- Adicionar comentários para documentação
COMMENT ON COLUMN empresas.site IS 'URL do site da empresa';
COMMENT ON COLUMN empresas.instagram IS 'Username do Instagram da empresa (com ou sem @)';

-- Verificar se os campos foram criados
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'empresas' 
AND column_name IN ('site', 'instagram')
ORDER BY column_name;
