"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface PatientCardProps {
    patient: typeof patientsTable.$inferSelect;

}

const PatientCard = ({ patient }: PatientCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const patientInitials = patient.name
        .split(" ")
        .map((name) => name[0])
        .join("");

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback>{patientInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-sm font-medium">{patient.name}</h3>
                        <p className="text-muted-foreground text-sm">
                            {patient.sex === "male" ? "Masculino" : "Feminino"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-sm">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{patient.email}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{patient.phoneNumber}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">
                            Ver detales
                        </Button>
                    </DialogTrigger>
                    <UpsertPatientForm patient={patient} onSuccess={() => setIsOpen(false)} isOpen />
                </Dialog>
            </CardFooter>
        </Card>
    );
};

export default PatientCard;
