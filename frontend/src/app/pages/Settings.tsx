import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/AccountForm"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="mb-6 bg-neutral-800" />
      <AccountForm />
    </div>
  )
}