import api from "./api";
import type { IKunde } from "../interface/IKunde";

export const getKunden = () =>
  api.get<IKunde[]>("/api/kunden");

export const getKundeById = (id: number) =>
  api.get<IKunde>(`/api/kunden/${id}`);

export const updateKunde = (id: number, data: Partial<IKunde>) =>
  api.put<IKunde>(`/api/kunden/${id}`, data);

export const deleteKunde = (id: number) =>
  api.delete(`/api/kunden/${id}`);
