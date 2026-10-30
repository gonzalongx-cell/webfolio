export type ModelStatus = "Activo" | "Pendiente" | "Suspendido";

export interface TalentModel {
  id: string;
  fullName: string;
  email: string;
  status: ModelStatus;
  tenantSlug: string;
  location: string;
  updatedAt: string;
}
