export interface Monkey {
  monkey_id: number;
  name: string;
  location: Location;
  isActive: boolean;
  address?: string;
}

export interface Location {
  id: number;
  name: string;
}
