"use client"

import { useState } from "react";
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
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  email: z.email("Endereço de e-mail inválido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
})

type FormData = z.infer<typeof formSchema>

export default function RegisterForm() {
  const [Loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormData) {
    await authClient.signUp.email({
      name: data.name,
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
        <CardTitle>Registre-se</CardTitle>
        <CardDescription>Crie sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-name">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="João Silva"
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-email">E-mail</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-email"
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
                  <FieldLabel htmlFor="form-register-password">Senha</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-password"
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
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit" form="form-register">
            Cadastrar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}