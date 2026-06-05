import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import config from "@/lib/config"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  if (config.selfHosted.isEnabled) {
    redirect(config.selfHosted.redirectUrl)
  }

  return (
    <Card className="w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center gap-5 shadow-sm border border-slate-100 bg-white rounded-2xl">
      <Image src="/logo/512.png" alt="Logo" width={80} height={80} className="w-20 h-20 rounded-2xl" />
      <div className="text-center">
        <CardTitle className="text-3xl font-bold text-slate-800">
          Welcome to TaxFlow
        </CardTitle>
        <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
      </div>
      <CardContent className="w-full p-0">
        <LoginForm />
      </CardContent>
    </Card>
  )
}
