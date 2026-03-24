import api from "./api";
import type { ITermin } from "../interface/ITermin";

export const getTermine = () =>
  api.get<ITermin[]>("/api/termine");

export const getTerminById = (id: number) =>
  api.get<ITermin>(`/api/termine/${id}`);

export const createTermin = (data: Partial<ITermin>) =>
  api.post<ITermin>("/api/termine", data);

export const updateTerminStatus = (id: number, status: string) =>
  api.patch(`/api/termine/${id}/status`, { status });

export const deleteTermin = (id: number) =>
  api.delete(`/api/termine/${id}`);
