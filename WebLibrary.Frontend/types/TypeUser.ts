import {UserRole} from "@/types/userRole";
import {CalendarDateTime} from "@internationalized/date";

export type TypeUser = {
    id: number;
    email: string;
    name: string,
    registeredAt: string,
    role: number,
    dateOfBirth?: string,
}