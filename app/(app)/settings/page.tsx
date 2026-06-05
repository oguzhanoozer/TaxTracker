import { getCurrentUser } from "@/lib/auth"
import { getSettings } from "@/models/settings"
import { getCurrencies } from "@/models/currencies"
import { getCategories } from "@/models/categories"
import { Globe, User, Flag, Link2, Upload, FolderOpen, AlertTriangle } from "lucide-react"
import Link from "next/link"
import GlobalSettingsForm from "@/components/settings/global-settings-form"

const settingsCards = [
  {
    title: "Profile & Plan",
    description: "Manage personal info, subscription, and team members.",
    icon: User,
    href: "/settings/profile",
  },
  {
    title: "Tax Rules (LLM)",
    description: "Configure AI providers, models, and analysis prompts.",
    icon: Flag,
    href: "/settings/llm",
  },
  {
    title: "Connected Apps",
    description: "Integrate with banks, accounting software, and other tools.",
    icon: Link2,
    href: "/settings/categories",
  },
  {
    title: "Backups",
    description: "Manage data backups and restore points.",
    icon: Upload,
    href: "/settings/backups",
  },
  {
    title: "Projects",
    description: "Organize your work into projects and clients.",
    icon: FolderOpen,
    href: "/settings/projects",
  },
]

export default async function SettingsPage() {
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)
  const currencies = await getCurrencies(user.id)
  const categories = await getCategories(user.id)

  return (
    <div className="w-full space-y-8">
      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <card.icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          </Link>
        ))}

        {/* Currencies & Language Card - Inline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col row-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Currencies & Language</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">Set default currency, language, and date formats.</p>
          <div className="mt-auto">
            <GlobalSettingsForm settings={settings} currencies={currencies} categories={categories} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <Link href="/settings/danger">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors" type="button">
              Reset Account
            </button>
          </Link>
          <Link href="/settings/danger">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors" type="button">
              Delete Data
            </button>
          </Link>
        </div>
        <p className="text-sm text-gray-800">These actions are irreversible. Proceed with caution.</p>
      </div>
    </div>
  )
}
