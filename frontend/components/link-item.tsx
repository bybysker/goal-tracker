import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface LinkItemProps {
  href: string
  icon: React.ElementType
  label: string
}

export function LinkItem({ href, icon: Icon, label }: LinkItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 hover:bg-blue-50/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  )
}

