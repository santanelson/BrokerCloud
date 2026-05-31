'use client'

import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border border-outline-variant',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[9px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null
  name: string
  className?: string
}

export function Avatar({ src, name, size, className }: AvatarProps) {
  if (src) {
    return (
      <div className={cn(avatarVariants({ size }), className)}>
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        avatarVariants({ size }),
        'bg-primary/10 text-primary font-manrope font-bold flex items-center justify-center',
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
