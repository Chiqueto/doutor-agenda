"use client";

import { MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { deleteAppointment } from "@/actions/delete-appointment";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appointmentsTable } from "@/db/schema";

interface AppointmentTableActionsProps {
    appointment: typeof appointmentsTable.$inferSelect & {
        patient: {
            id: string;
            name: string;
        };
        doctor: {
            id: string;
            name: string;
            speciality: string;
        };
    };
}

const AppointmentTableActions = ({ appointment }: AppointmentTableActionsProps) => {
    const deleteAppointmentAction = useAction(deleteAppointment, {
        onSuccess: () => {
            toast.success("Agendamento deletado com sucesso");
        },
        onError: () => {
            toast.error("Erro ao deletar agendamento");
        },
    });

    const handleDeleteAppointmentClick = () => {
        deleteAppointmentAction.execute({
            id: appointment.id,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    {appointment.patient.name} - {appointment.doctor.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2Icon /> Deletar
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tem certeza que deseja deletar este agendamento?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Essa ação não pode ser revertida. Isso irá deletar o
                                agendamento permanentemente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAppointmentClick}>
                                Deletar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AppointmentTableActions;
