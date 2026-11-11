"use client"

import {useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation";

const formSchema = z.object({
  email: z.email("Endereço de e-mail inválido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
})

type FormData = z.infer<typeof formSchema>

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormData) {
    await authClient.signIn.email({
          email: data.email, 
          password: data.password,
          callbackURL: "/dashboard"
        }, {
          onRequest() {
            setLoading(true)
          },
          onSuccess() {
            setLoading(false)
            return redirect("/dashboard")
          },
          onError(context) {
            setLoading(false)
            console.log(context.error)
          }
        });
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Entre com sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">E-mail</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="joao.silva@exemplo.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-password">Senha</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="form-login">
            Entrar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}