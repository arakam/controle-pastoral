'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react'
import { useSupabase } from './SupabaseProvider'

interface ImageUploadProps {
  empresaId: string
  onImagesChange: (images: { logo?: string; galeria: string[] }) => void
  initialImages?: { logo?: string; galeria: string[] }
}

export default function ImageUpload({ empresaId, onImagesChange, initialImages }: ImageUploadProps) {
  const { supabase } = useSupabase()
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<{ logo?: string; galeria: string[] }>(
    initialImages || { logo: undefined, galeria: [] }
  )
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const galeriaInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File, isLogo: boolean = false) => {
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${empresaId}-${Date.now()}-${Math.random()}.${fileExt}`
    const filePath = `empresas/${empresaId}/${fileName}`

    setUploading(true)

    try {
      const { error: uploadError } = await supabase.storage
        .from('empresa-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('empresa-images')
        .getPublicUrl(filePath)

      if (isLogo) {
        const newImages = { ...images, logo: publicUrl }
        setImages(newImages)
        onImagesChange(newImages)
      } else {
        const newImages = { 
          ...images, 
          galeria: [...images.galeria, publicUrl].slice(0, 6) 
        }
        setImages(newImages)
        onImagesChange(newImages)
      }

    } catch (error) {
      console.error('Erro no upload:', error)
      
      // Mostrar erro mais detalhado
      let mensagemErro = 'Erro ao fazer upload da imagem'
      
      if (error && typeof error === 'object') {
        if ('message' in error) {
          mensagemErro = `Erro: ${error.message}`
        } else if ('error_description' in error) {
          mensagemErro = `Erro: ${error.error_description}`
        } else if ('details' in error) {
          mensagemErro = `Erro: ${error.details}`
        } else {
          mensagemErro = `Erro: ${JSON.stringify(error)}`
        }
      } else if (error && typeof error === 'string') {
        mensagemErro = `Erro: ${error}`
      }
      
      console.log('Erro detalhado:', {
        error,
        type: typeof error,
        keys: error && typeof error === 'object' ? Object.keys(error) : [],
        stringified: JSON.stringify(error, null, 2)
      })
      
      alert(mensagemErro)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async (imageUrl: string, isLogo: boolean = false) => {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `empresas/${empresaId}/${fileName}`

      // Remover do storage
      await supabase.storage
        .from('empresa-images')
        .remove([filePath])

      // Atualizar estado local
      if (isLogo) {
        const newImages = { ...images, logo: undefined }
        setImages(newImages)
        onImagesChange(newImages)
      } else {
        const newImages = { 
          ...images, 
          galeria: images.galeria.filter(img => img !== imageUrl) 
        }
        setImages(newImages)
        onImagesChange(newImages)
      }

    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      
      // Mostrar erro mais detalhado
      let mensagemErro = 'Erro ao remover imagem'
      
      if (error && typeof error === 'object' && 'message' in error) {
        mensagemErro = `Erro: ${error.message}`
      } else if (error && typeof error === 'string') {
        mensagemErro = `Erro: ${error}`
      }
      
      alert(mensagemErro)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file, true)
    }
  }

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      if (images.galeria.length < 6) {
        uploadImage(file, false)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Upload da Logo */}
      <div>
        <label className="block text-sm font-medium mb-2">Logo da Empresa</label>
        <div className="flex items-center gap-4">
          {images.logo ? (
            <div className="relative">
              <img 
                src={images.logo} 
                alt="Logo da empresa" 
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(images.logo!, true)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload size={16} />
              {uploading ? 'Enviando...' : 'Selecionar Logo'}
            </button>
          </div>
        </div>
      </div>

      {/* Upload da Galeria */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Galeria de Imagens ({images.galeria.length}/6)
        </label>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {images.galeria.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
                alt={`Imagem ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(image, false)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          {images.galeria.length < 6 && (
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <input
            ref={galeriaInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriaChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => galeriaInputRef.current?.click()}
            disabled={uploading || images.galeria.length >= 6}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? 'Enviando...' : 'Adicionar Imagens'}
          </button>
          
          {images.galeria.length > 0 && (
            <button
              type="button"
              onClick={() => {
                images.galeria.forEach(img => removeImage(img, false))
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Limpar Todas
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
