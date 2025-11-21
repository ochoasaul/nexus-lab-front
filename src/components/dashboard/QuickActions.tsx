import Button from '../Button/Button'
import { LoanIcon, SupportIcon, InventoryIcon, CalendarIcon } from '../icons/Icons'
import { Panel } from './Panel'
import { useDashboard } from '../../pages/Dashboard/useDashboard'

export function QuickActions() {
  const { simulateInventoryAudit, simulateSupport, simulateLostObject, simulateReservation } = useDashboard()

  return (
    <Panel title="Acciones rápidas">
      <div className="flex flex-wrap gap-3">
        <Button 
          label="Registro de préstamos" 
          variant="primary" 
          onClick={simulateInventoryAudit} 
          Icon={LoanIcon} 
        />
        <Button 
          label="Registro de Soporte" 
          variant="secondary" 
          onClick={simulateSupport} 
          Icon={SupportIcon} 
        />
        <Button 
          label="Registro de Objetos perdidos" 
          variant="ghost" 
          onClick={simulateLostObject} 
          Icon={InventoryIcon} 
        />
        <Button 
          label="Registro de Reservas" 
          variant="ghost" 
          onClick={simulateReservation} 
          Icon={CalendarIcon} 
        />
      </div>
    </Panel>
  )
}
