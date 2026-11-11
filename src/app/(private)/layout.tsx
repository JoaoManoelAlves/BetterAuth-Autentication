import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { ReactNode } from "react"

export  default async function PrivateLayout({
  children,
}: {
  children: ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if(!session) {
        redirect("/signin")
    }
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  )
}