import {
  AlertTriangle,
  Laptop,
  Laugh,
  Monitor,
  MonitorOff,
  Skull,
  Terminal,
  Zap,
  type LucideProps,
} from "lucide-react"
import type { Category } from "@/lib/screens"

const ICONS = { Monitor, Laptop, Skull, Terminal, AlertTriangle, Zap, MonitorOff, Laugh }

export function CategoryIcon({
  name,
  ...props
}: { name: Category["icon"] } & LucideProps) {
  const Icon = ICONS[name]
  return <Icon {...props} />
}
