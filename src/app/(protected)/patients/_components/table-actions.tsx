import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditIcon, Trash2Icon } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { MoreVerticalIcon } from "lucide-react";
import { patientsTable } from "@/db/schema";
import UpsertPatientForm from "./upsert-patient-form";
import { useState } from "react";
interface PatientTableActionsProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientTableActions = ({ patient }: PatientTableActionsProps) => {
  const [upsertPatientFormIsOpen, setUpsertPatientFormIsOpen] = useState(false);

  return (
    <Dialog
      open={upsertPatientFormIsOpen}
      onOpenChange={setUpsertPatientFormIsOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpsertPatientFormIsOpen(true)}>
            <EditIcon /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2Icon /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertPatientForm
        isOpen={upsertPatientFormIsOpen}
        patient={patient}
        onSuccess={() => setUpsertPatientFormIsOpen(false)}
      />
    </Dialog>
  );
};

export default PatientTableActions;
