import { QRCodeSVG } from 'qrcode.react'

export interface TicketQrProps {
  value: string
  size?: number
}

export function TicketQr({ value, size = 168 }: TicketQrProps) {
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft print:shadow-none print:border">
      <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#0f172a" level="M" marginSize={2} />
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Scan to verify</p>
    </div>
  )
}
