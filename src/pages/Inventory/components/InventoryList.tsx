import Button from '@/components/ui/Button/Button'
import type { InventarioItem } from '@/services/inventoryService'

interface InventoryListProps {
  inventory: InventarioItem[]
  isSuperAdmin: boolean
  onEdit: (item: InventarioItem) => void
  onDelete: (id: string | number) => void
}

export function InventoryList({ inventory, isSuperAdmin, onEdit, onDelete }: InventoryListProps) {
  if (inventory.length === 0) {
    return (
      <p className="text-sm text-charcoal-500 py-8 text-center">
        No hay productos en el inventario.
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {inventory.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-charcoal-100 bg-white p-4"
        >
          <header className="mb-3 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-charcoal-900">
                {item.producto?.nombre || 'Sin nombre'}
              </h4>
              {item.producto?.codigo_base && (
                <p className="text-xs text-charcoal-500 mt-1">
                  Código: {item.producto.codigo_base}
                </p>
              )}
              {item.producto?.descripcion && (
                <p className="text-sm text-charcoal-600 mt-2">
                  {item.producto.descripcion}
                </p>
              )}
            </div>
          </header>
          <footer className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-900">
                Cantidad: <span className="text-primary-600">{item.cantidad}</span>
              </p>
              {isSuperAdmin && item.laboratorio && (
                <p className="text-xs text-charcoal-500 mt-1">
                  {item.laboratorio.nombre}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                label="Editar"
                variant="ghost"
                onClick={() => onEdit(item)}
                className="text-xs"
              />
              <Button
                label="Eliminar"
                variant="ghost"
                onClick={() => onDelete(item.id)}
                className="text-xs text-red-600 hover:text-red-700"
              />
            </div>
          </footer>
        </article>
      ))}
    </div>
  )
}

