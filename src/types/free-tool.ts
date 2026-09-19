export type FreeToolStatus = "available" | "planned";

export type FreeToolKatyaConnection = "general" | "katya";

export type FreeTool = {
  name: string;
  slug: string;
  category: string;
  status: FreeToolStatus;
  description: string;
  shortDescription: string;
  katyaConnection: FreeToolKatyaConnection;
  href: string;
};
