"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { patientsTable } from "@/db/schema";

const formSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    phoneNumber: z.string().min(1, { message: "Número de telefone é obrigatório" }),
    sex: z.enum(["male", "female"], { message: "Sexo é obrigatório" }),
});

interface UpsertPatientFormProps {
    onSuccess?: () => void;
    patient?: typeof patientsTable.$inferSelect;
    isOpen: boolean;
}

const UpsertPatientForm = ({ onSuccess, patient, isOpen }: UpsertPatientFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        shouldUnregister: true,
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: patient?.name ?? "",
            email: patient?.email ?? "",
            phoneNumber: patient?.phoneNumber ?? "",
            sex: patient?.sex ?? undefined,
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset(patient)
        }
    }, [isOpen, form, patient])

    const upsertPatientAction = useAction(upsertPatient, {
        onSuccess: () => {
            onSuccess?.();
            toast.success(patient ? "Paciente atualizado com sucesso" : "Paciente adicionado com sucesso");
        },
        onError: () => {
            toast.error("Erro ao salvar paciente");
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        upsertPatientAction.execute({
            ...values,
            id: patient?.id,
        });
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{patient ? patient.name : "Adicionar Paciente"}</DialogTitle>
                <DialogDescription>
                    {patient
                        ? "Edite as informações desse paciente"
                        : "Adicione um novo paciente à sua clínica"}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do paciente</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Digite o nome completo" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="paciente@email.com"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de telefone</FormLabel>
                                <PatternFormat
                                    format="(##) #####-####"
                                    mask="_"
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value.value);
                                    }}
                                    customInput={Input}
                                    placeholder="(00) 00000-0000"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sexo</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o sexo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Masculino</SelectItem>
                                        <SelectItem value="female">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={upsertPatientAction.isExecuting}
                        >
                            {upsertPatientAction.isExecuting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {patient ? "Atualizar" : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
};

export default UpsertPatientForm;
