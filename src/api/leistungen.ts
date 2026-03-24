import api from "./api";
import type { ILeistung } from "../interface/ILeistung";

export const getLeistungen = () =>
  api.get<ILeistung[]>("/api/leistungen");

export const getLeistungById = (id: number) =>
  api.get<ILeistung>(`/api/leistungen/${id}`);

export const createLeistung = (data: Partial<ILeistung>) =>
  api.post<ILeistung>("/api/leistungen", data);

export const updateLeistung = (id: number, data: Partial<ILeistung>) =>
  api.put<ILeistung>(`/api/leistungen/${id}`, data);

export const deleteLeistung = (id: number) =>
  api.delete(`/api/leistungen/${id}`);
