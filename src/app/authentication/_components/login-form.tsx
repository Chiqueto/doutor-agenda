"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().trim().email({ message: "Email inválido" }).min(1, { message: "Email é obrigatório" }),
    password: z.string().trim().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
})

const LoginForm = () => {

    const router = useRouter()
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
        }, {
                onSuccess:() => {
                    router.push("/dashboard")
                },
                onError: () => {
                    toast.error("Email ou senha inválidos!")
                }
            }
        )
    }
    return ( 
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Faça login para continuar para continuar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="digite seu email..." {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="digite sua senha..." {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Entrar"}</Button>
                    </CardFooter>
                </form>

            </Form>
        </Card>
     );
}
 
export default LoginForm;