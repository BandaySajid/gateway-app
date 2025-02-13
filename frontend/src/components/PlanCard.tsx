import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleCheckBig } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface PlanCardProps {
  title: string
  description: string
  price?: string
  features: string[]
  mostPopular?: boolean
  onUpgrade: () => void
  upgradable?: boolean
  currentPlan?: boolean
  customButtonText?: string;
}

export function PlanCard({
  title,
  description,
  price,
  features,
  mostPopular,
  upgradable,
  onUpgrade,
  currentPlan,
  customButtonText
}: PlanCardProps) {
  return (
    <Card className={cn(mostPopular ? "border-2 border-primary" : "", "bg-neutral-950 border-neutral-800 text-neutral-50 h-full flex flex-col ")}>
      <CardHeader className="relative">
        {currentPlan && (
            <Badge className="mt-2 absolute right-4 top-2" variant="secondary">
              Current Plan
            </Badge>
          )}
        <CardTitle className="text-2xl font-bold text-cyan-400">{title}</CardTitle>
        < CardDescription>{description}</CardDescription>
      </CardHeader>
      < CardContent className="relative flex flex-col h-full">
        <div className="space-y-2">
          <div className="text-4xl font-bold">{price}</div>
          <ul className="list-none pl-0 space-y-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-center space-x-2">
                <CircleCheckBig className="h-4 max-w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn("mt-auto", upgradable ? "" : "hidden")}>
          <Button variant={'default'} className="w-full mt-4 bg-neutral-50 text-neutral-900 hover:bg-neutral-50/90" onClick={onUpgrade}>
            {customButtonText ? customButtonText :"Upgrade"}
          </Button> 
        {mostPopular && !currentPlan && (
            <Badge className="w-full mt-2" variant="secondary">
              Most Popular
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
