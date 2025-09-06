export type Powerstats = {
  intelligence: number; strength: number; speed: number;
  durability: number; power: number; combat: number;
};

export type Images = {
  xs: string; sm: string; md: string; lg: string;
};

export type Biography = { fullName: string };

export type Hero = {
  id: number;
  name: string;
  slug: string;
  powerstats: Powerstats;
  images: Images;
  biography?: Biography
};
