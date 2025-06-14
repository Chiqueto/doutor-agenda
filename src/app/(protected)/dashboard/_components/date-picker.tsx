"use client";

import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
//TODO: alterar data FROM para frente também
export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [from, setFrom] = useQueryState(
    "from",
    parseAsIsoDate.withDefault(new Date()),
  );
  const [to, setTo] = useQueryState(
    "to",
    parseAsIsoDate.withDefault(addMonths(new Date(), 1)),
  );

  const date = {
    from,
    to,
  };

  console.log(date);

  const handleDateSelect = (dateRange: DateRange | undefined) => {
    if (dateRange?.from && dateRange?.to) {
      setFrom(dateRange.from, {
        shallow: false,
      });
      setTo(dateRange.to, {
        shallow: false,
      });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd, LLL Y", { locale: ptBR })} -{" "}
                  {format(date.to, "dd, LLL Y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd, LLL Y", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
