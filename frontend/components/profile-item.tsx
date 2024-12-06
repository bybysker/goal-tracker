import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface ProfileItemProps {
  label: string
  value: string
  onEdit: (value: string) => void
}

export function ProfileItem({ label, value, onEdit }: ProfileItemProps) {
  const [editValue, setEditValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const truncateValue = (text: string) => {
    if (label !== 'Name' && text.length > 10) {
      return `${text.slice(0, 10)}...`
    }
    return text
  }

  const handleSave = () => {
    onEdit(editValue)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="flex items-center justify-between p-4 hover:bg-blue-50/50 transition-colors cursor-pointer">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{truncateValue(value)}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit {label}</SheetTitle>
          <SheetDescription>
            Make changes to your {label.toLowerCase()}. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Label htmlFor={label}>
            {label}
          </Label>
          {label.toLowerCase() === 'passions' || label.toLowerCase() === 'life goals' ? (
            <Textarea
              id={label}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="mt-2"
            />
          ) : (
            <Input
              id={label}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="mt-2"
            />
          )}
        </div>
        <Button className="mt-4" onClick={handleSave}>Save Changes</Button>
      </SheetContent>
    </Sheet>
  )
}
