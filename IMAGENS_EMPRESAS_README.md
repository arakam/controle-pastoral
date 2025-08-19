# Sistema de Imagens para Empresas

Este documento explica como configurar e usar o sistema de upload de imagens para empresas no Controle Pastoral.

## 🚀 Funcionalidades Implementadas

- **Logo da Empresa**: Upload de uma imagem de logo (recomendado: quadrada, 200x200px)
- **Galeria de Imagens**: Upload de até 6 imagens adicionais para mostrar produtos/serviços
- **Interface Responsiva**: Funciona perfeitamente em dispositivos móveis
- **Gerenciamento de Arquivos**: Possibilidade de remover imagens individualmente

## ⚙️ Configuração do Banco de Dados

### 1. Execute o script SQL
Execute o arquivo `database_update.sql` no SQL Editor do Supabase para:
- Adicionar colunas `logo` e `galeria` na tabela `empresas`
- Configurar políticas de segurança para o storage

### 2. Criar Bucket de Storage
No painel do Supabase > Storage:
1. Clique em "Create bucket"
2. Nome: `empresa-images`
3. Public bucket: ✅ **Marcar como público**
4. File size limit: `10MB`
5. Allowed MIME types: `image/*`

## 🔐 Políticas de Segurança

O sistema inclui políticas para:
- ✅ Usuários autenticados podem fazer upload
- ✅ Imagens são públicas para visualização
- ✅ Usuários podem atualizar/deletar suas imagens
- ❌ Usuários não autenticados não podem fazer upload

## 📱 Como Usar

### Para Administradores
1. Acesse `/admin/empresas/nova` para cadastrar nova empresa
2. Acesse `/admin/empresas/[id]` para editar empresa existente
3. Use a seção "Imagens da Empresa" para:
   - Fazer upload da logo
   - Adicionar até 6 imagens na galeria
   - Remover imagens individualmente

### Para Participantes
1. Acesse `/empresas` para ver todas as empresas
2. Cada empresa mostra:
   - Logo (ou placeholder se não tiver)
   - Galeria de imagens (se existir)
   - Informações de contato

## 🎨 Especificações Técnicas

### Formatos Suportados
- **Tipos**: JPG, PNG, GIF, WebP
- **Tamanho máximo**: 10MB por arquivo
- **Resolução recomendada**: 
  - Logo: 200x200px (quadrada)
  - Galeria: 800x600px (4:3)

### Estrutura de Arquivos
```
empresa-images/
├── empresas/
│   ├── [empresa-id]/
│   │   ├── logo-[timestamp].jpg
│   │   ├── galeria-[timestamp]-1.jpg
│   │   ├── galeria-[timestamp]-2.jpg
│   │   └── ...
```

## 🛠️ Componentes Criados

### `ImageUpload.tsx`
- Gerencia upload de logo e galeria
- Validação de tipos de arquivo
- Interface drag & drop
- Remoção de imagens

### Modificações em:
- `FormularioEmpresa.tsx`: Adicionado seção de imagens
- `empresas/page.tsx`: Exibição de logo e galeria
- Interface `Empresa`: Novos campos `logo` e `galeria`

## 🔍 Troubleshooting

### Erro "Bucket não encontrado"
- Verifique se o bucket `empresa-images` foi criado
- Confirme se o nome está exatamente igual

### Erro de permissão
- Execute as políticas de segurança do `database_update.sql`
- Verifique se o usuário está autenticado

### Imagens não aparecem
- Verifique se o bucket é público
- Confirme se as URLs estão sendo salvas corretamente no banco

## 📈 Próximas Melhorias

- [ ] Compressão automática de imagens
- [ ] Redimensionamento automático
- [ ] Preview em tempo real
- [ ] Drag & drop para reordenar galeria
- [ ] Validação de dimensões mínimas
- [ ] Backup automático de imagens

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Confirme se todas as configurações foram aplicadas
3. Teste com uma empresa nova primeiro
