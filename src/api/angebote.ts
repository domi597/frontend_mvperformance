import api from "./api";
import type { IAngebot } from "../interface/IAngebot";

export const getAngebote = () =>
  api.get<IAngebot[]>("/api/angebote");

export const getAngebotById = (id: number) =>
  api.get<IAngebot>(`/api/angebote/${id}`);

export const createAngebot = (data: Partial<IAngebot>) =>
  api.post<IAngebot>("/api/angebote", data);

export const updateAngebot = (id: number, data: Partial<IAngebot>) =>
  api.put<IAngebot>(`/api/angebote/${id}`, data);

export const deleteAngebot = (id: number) =>
  api.delete(`/api/angebote/${id}`);
