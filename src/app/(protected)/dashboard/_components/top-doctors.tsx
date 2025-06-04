import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DoctorsListProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    speciality: string;
    appointments: number;
  }[];
}

export default function TopDoctors({ doctors }: DoctorsListProps) {
  return (
    <Card className="mx-auto w-full max-w-md bg-white">
      {/* Header */}
      <CardHeader className="flex items-center justify-between p-4 pb-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-muted-foreground" />
          <CardTitle className="text-base">Médicos</CardTitle>
        </div>
        <span className="text-muted-foreground text-sm">Ver todos</span>
      </CardHeader>
      <Separator />
      {/* Doctors List */}
      <div className="space-y-1 px-2">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="border-none shadow-none transition-colors hover:bg-gray-50"
          >
            <CardContent className="flex items-center gap-3 py-1">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    doctor.avatarImageUrl ||
                    "/placeholder.svg?height=48&width=48"
                  }
                  alt={doctor.name}
                />
                <AvatarFallback className="bg-blue-100 font-medium text-blue-600">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-gray-900">
                  {doctor.name}
                </h3>
                <p className="truncate text-sm text-gray-500">
                  {doctor.speciality}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-medium text-gray-700">
                  {doctor.appointments} agend.
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
}
