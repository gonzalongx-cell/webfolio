import type {
  PortfolioMediaItem,
  SkillServiceItem,
  ClientAccessLinkItem,
} from "@/types/models";

export const MOCK_TENANT_MODEL = {
  id: "c1c22f4c-d80b-40d0-a3db-3473c3e5b5be",
  fullName: "Valentina Mendoza",
  firstName: "Valentina",
  handle: "@valentina.m",
  location: "Ciudad de México · MX",
  status: "active" as const,
  avatarInitials: "VM",
};

export const MOCK_PORTFOLIO_MEDIA: PortfolioMediaItem[] = [
  {
    id: "med-01",
    model_id: MOCK_TENANT_MODEL.id,
    media_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    type: "photo",
    caption: "Editorial Vogue Latam · Studio",
    created_at: "2026-10-28T14:00:00Z",
  },
  {
    id: "med-02",
    model_id: MOCK_TENANT_MODEL.id,
    media_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    type: "video",
    caption: "Runway Walk Reel · 4K",
    created_at: "2026-10-26T11:30:00Z",
  },
  {
    id: "med-03",
    model_id: MOCK_TENANT_MODEL.id,
    media_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    type: "photo",
    caption: "Polaroid Natural Light · Digitals",
    created_at: "2026-10-24T09:15:00Z",
  },
  {
    id: "med-04",
    model_id: MOCK_TENANT_MODEL.id,
    media_url:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
    type: "photo",
    caption: "Campaña Resort Otoño/Invierno",
    created_at: "2026-10-20T18:45:00Z",
  },
];

export const MOCK_SKILLS_SERVICES: SkillServiceItem[] = [
  {
    id: "srv-01",
    model_id: MOCK_TENANT_MODEL.id,
    title: "Sesión Editorial / Lookbook (Full Day)",
    description:
      "Jornada de 8 horas en estudio o locación. Incluye derechos digitales por 6 meses.",
    rate_amount: 950,
    is_active: true,
  },
  {
    id: "srv-02",
    model_id: MOCK_TENANT_MODEL.id,
    title: "Pasarela & Showroom VIP",
    description:
      "Fitting previo + desfile o presentación privada para compradores y prensa.",
    rate_amount: 600,
    is_active: true,
  },
  {
    id: "srv-03",
    model_id: MOCK_TENANT_MODEL.id,
    title: "Contenido UGC & Reels de Marca",
    description:
      "Grabación de 3 piezas verticales en alta definición con entrega en 48h.",
    rate_amount: 420,
    is_active: false,
  },
];

export const MOCK_CLIENT_LINKS: ClientAccessLinkItem[] = [
  {
    id: "lnk-01",
    model_id: MOCK_TENANT_MODEL.id,
    unique_token: "wf_tk_9a8f2c1e",
    client_name: "Casa Editorial Condé Nast MX",
    expires_at: "2026-11-08T23:59:00Z",
  },
  {
    id: "lnk-02",
    model_id: MOCK_TENANT_MODEL.id,
    unique_token: "wf_tk_4b7d19f0",
    client_name: "Agencia L'Étoile Casting París",
    expires_at: "2026-11-03T18:00:00Z",
  },
];
