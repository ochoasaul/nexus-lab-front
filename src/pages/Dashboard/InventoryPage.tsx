import { useState } from 'react'
import Button from '../../components/Button/Button'
import { Panel } from '../../components/dashboard/Panel'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { useDashboard } from './useDashboard'

function InventoryPage() {
  const { user, selectedLab, dataset, simulateInventoryAudit } = useDashboard()
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'hardware' | 'consumible' | 'seguridad'>('all')

  if (!user || !selectedLab) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Selecciona un laboratorio para ver el inventario.
      </section>
    )
  }

  return (
    <Panel
      title="Inventario"
      actions={
        <Button
          label="Auditar inventario"
          variant="secondary"
          onClick={simulateInventoryAudit}
        />
      }
    >
      <div className="mt-4 flex gap-2">
        {(['all', 'hardware', 'consumible', 'seguridad'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setInventoryFilter(cat)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              inventoryFilter === cat ? 'bg-primary-50 text-primary-600' : 'bg-charcoal-50 text-charcoal-700'
            }`}
          >
            {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dataset.inventory
          .filter((it) => inventoryFilter === 'all' || it.category === inventoryFilter)
          .map((item) => (
            <article key={item.id} className="rounded-2xl border border-charcoal-100 bg-surface p-4">
              <header className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-charcoal-500">{item.category === 'hardware' ? 'Equipo' : 'Consumible'}</p>
                  <h4 className="text-lg font-semibold text-charcoal-900">{item.name}</h4>
                </div>
                <StatusBadge label={item.status} />
              </header>
              <footer className="mt-4 flex gap-4 text-sm text-charcoal-600">
                <span>Total: {item.quantity}</span>
                <span>Disponibles: {item.available}</span>
              </footer>
            </article>
          ))}
      </div>
    </Panel>
  )
}

export default InventoryPage
