"use client";

import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  isDateAvailable?: (date: Date) => boolean;
}

export function DatePicker({
  date,
  onSelect,
  disabled = false,
  placeholder = "Selecione uma data",
  isDateAvailable,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? dayjs(date).format("DD/MM/YYYY") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          disabled={(date) => {
            const isPastDate = date < new Date();
            const isAvailable = isDateAvailable?.(date) ?? false;
            return isPastDate || !isAvailable;
          }}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
