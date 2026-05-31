'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useUploadImage } from '@/lib/hooks'

interface ImageUploadProps {
  onUpload: (url: string) => void
  className?: string
}

export function ImageUpload({ onUpload, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const uploadImage = useUploadImage()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith('image/'))
    if (validFiles.length === 0) {
      alert('Por favor, selecione apenas imagens válidas.')
      return
    }

    for (const file of validFiles) {
      try {
        const result = await uploadImage.mutateAsync(file)
        if (result.url) {
          onUpload(result.url)
        }
      } catch (err: any) {
        alert(`Erro no upload da imagem ${file.name}: ${err.message}`)
      }
    }
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all text-center',
        isDragging
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50',
        uploadImage.isPending && 'opacity-50 pointer-events-none',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploadImage.isPending}
      />
      
      {uploadImage.isPending ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-body-sm font-bold animate-pulse">Enviando...</p>
        </div>
      ) : (
        <>
          <span className="material-symbols-outlined text-4xl mb-2 opacity-60">cloud_upload</span>
          <p className="text-body-sm font-semibold text-on-surface">
            Arraste fotos aqui ou clique para selecionar
          </p>
          <p className="text-[10px] mt-1 opacity-70">JPG, PNG até 10MB</p>
        </>
      )}
    </div>
  )
}
