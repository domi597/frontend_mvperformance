import { AppointmentStatus } from "../types/AppointmentStatus";

export interface IAppointment {
  id: number;
  customerId: number;
  customerName: string;
  serviceType: string;
  date: string;
  time: string;
  brand: string;
  model: string;
  year: number | null;
  licensePlate: string;
  status: AppointmentStatus;
  price: number | null;
  note: string;
  createdAt: string;
}
