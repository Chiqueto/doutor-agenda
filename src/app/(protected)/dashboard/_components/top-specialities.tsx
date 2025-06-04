import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Stethoscope,
  Baby,
  Activity,
  Hand,
  Bone,
  Eye,
  Brain,
  Hospital,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface SpecialitiesListProps {
  specialities: {
    speciality: string;
    appointments: number;
  }[];
}

const getSpecialtyIcon = (specialty: string) => {
  const specialtyLower = specialty.toLowerCase();

  if (specialtyLower.includes("cardiolog")) return Heart;
  if (
    specialtyLower.includes("ginecolog") ||
    specialtyLower.includes("obstetri")
  )
    return Baby;
  if (specialtyLower.includes("pediatr")) return Activity;
  if (specialtyLower.includes("dermatolog")) return Hand;
  if (
    specialtyLower.includes("ortoped") ||
    specialtyLower.includes("traumatolog")
  )
    return Bone;
  if (specialtyLower.includes("oftalmolog")) return Eye;
  if (specialtyLower.includes("neurolog")) return Brain;

  return Stethoscope;
};

export default function TopSpecialities({
  specialities,
}: SpecialitiesListProps) {
  const totalAppointments = specialities.reduce(
    (acc, curr) => acc + curr.appointments,
    0,
  );
  console.log(totalAppointments);
  return (
    <Card className="mx-auto w-full max-w-md bg-white">
      {/* Header */}
      <CardHeader className="flex items-center justify-between p-4 pb-6">
        <div className="flex items-center gap-2">
          <Hospital className="text-muted-foreground" />
          <CardTitle className="text-base">Especialidades</CardTitle>
        </div>
        <span className="text-muted-foreground text-sm">Ver todos</span>
      </CardHeader>
      <Separator />
      {/* Doctors List */}
      <div className="space-y-1 px-2">
        {specialities.map((speciality) => {
          const Icon = getSpecialtyIcon(speciality.speciality);
          const progressValue =
            (speciality.appointments / totalAppointments) * 100;
          return (
            <Card
              key={speciality.speciality}
              className="border-none shadow-none transition-colors hover:bg-gray-50"
            >
              <CardContent className="flex items-center gap-3 py-1">
                <Avatar className="text-primary h-12 w-12">
                  <AvatarFallback className="bg-blue-100 font-medium text-blue-600">
                    <Icon className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex h-12 min-w-0 flex-1 flex-col justify-between">
                  <h3 className="truncate font-medium">
                    {speciality.speciality}
                  </h3>
                  <Progress value={progressValue} />
                </div>

                <div className="text-right">
                  <span className="align-text-bottom text-sm font-medium text-gray-700">
                    {speciality.appointments} agend.
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
