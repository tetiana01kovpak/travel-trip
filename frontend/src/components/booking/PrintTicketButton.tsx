import { Printer } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function PrintTicketButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.print()}
      leftIcon={<Printer className="size-4" />}
      className="print:hidden"
    >
      Print ticket
    </Button>
  )
}
