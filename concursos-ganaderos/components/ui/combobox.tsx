"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export type ComboboxOption = {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  createNewLabel?: string
  onCreateNew?: (value: string) => Promise<void>
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opción...",
  emptyMessage = "No se encontraron resultados.",
  createNewLabel = "Crear nuevo",
  onCreateNew,
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [newValue, setNewValue] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleCreateNew = async () => {
    if (!newValue.trim() || !onCreateNew) return

    setIsCreating(true)
    try {
      await onCreateNew(newValue)
      setDialogOpen(false)
      setNewValue("")
    } catch (error) {
      console.error("Error creating new item:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar..." value={searchValue} onValueChange={setSearchValue} />
            <CommandList>
              <CommandEmpty>
                {emptyMessage}
                {onCreateNew && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="mt-2 w-full justify-start"
                        onClick={() => setNewValue(searchValue)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {createNewLabel}: {searchValue}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{createNewLabel}</DialogTitle>
                        <DialogDescription>Ingrese el nombre para crear un nuevo registro.</DialogDescription>
                      </DialogHeader>
                      <Input
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Nombre"
                        className="mt-4"
                      />
                      <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateNew} disabled={!newValue.trim() || isCreating}>
                          {isCreating ? "Creando..." : "Crear"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
                {searchValue &&
                  onCreateNew &&
                  options.length > 0 &&
                  !options.some((option) => option.label.toLowerCase() === searchValue.toLowerCase()) && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-2 w-full justify-start"
                          onClick={() => setNewValue(searchValue)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {createNewLabel}: {searchValue}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{createNewLabel}</DialogTitle>
                          <DialogDescription>Ingrese el nombre para crear un nuevo registro.</DialogDescription>
                        </DialogHeader>
                        <Input
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Nombre"
                          className="mt-4"
                        />
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleCreateNew} disabled={!newValue.trim() || isCreating}>
                            {isCreating ? "Creando..." : "Crear"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

