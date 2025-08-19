-- Script para atualizar a tabela empresas com suporte a imagens
-- Execute este script no seu banco Supabase

-- Adicionar coluna para logo da empresa
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS logo TEXT;

-- Adicionar coluna para galeria de imagens (array de URLs)
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS galeria TEXT[] DEFAULT '{}';

-- Criar bucket de storage para as imagens das empresas (se não existir)
-- Nota: Execute isso no painel do Supabase > Storage > Create bucket
-- Nome do bucket: empresa-images
-- Public bucket: true
-- File size limit: 10MB
-- Allowed MIME types: image/*

-- Política de segurança para o bucket (execute no SQL Editor do Supabase)
-- Permitir upload de imagens para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload de imagens" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'empresa-images' AND auth.role() = 'authenticated');

-- Permitir visualização pública das imagens
CREATE POLICY "Imagens são públicas para visualização" ON storage.objects
FOR SELECT USING (bucket_id = 'empresa-images');

-- Permitir que usuários autenticados atualizem suas próprias imagens
CREATE POLICY "Usuários podem atualizar suas próprias imagens" ON storage.objects
FOR UPDATE USING (bucket_id = 'empresa-images' AND auth.role() = 'authenticated');

-- Permitir que usuários autenticados deletem suas próprias imagens
CREATE POLICY "Usuários podem deletar suas próprias imagens" ON storage.objects
FOR DELETE USING (bucket_id = 'empresa-images' AND auth.role() = 'authenticated');

-- Comentários nas colunas para documentação
COMMENT ON COLUMN empresas.logo IS 'URL da logo da empresa';
COMMENT ON COLUMN empresas.galeria IS 'Array de URLs das imagens da galeria da empresa (máximo 6)';
