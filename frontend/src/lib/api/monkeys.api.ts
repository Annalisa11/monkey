import { API_URL } from '@/constants';
import {
  type Location,
  type LocationForm,
  type Monkey,
  type MonkeyForm,
  type Route,
  type RouteForm,
} from '@validation';

export async function getMonkeys(): Promise<Monkey[]> {
  const response = await fetch(`${API_URL}/v1/monkeys`);
  if (!response.ok) {
    throw new Error('Failed to fetch monkeys');
  }
  return response.json();
}

export async function createMonkey(monkey: MonkeyForm): Promise<Monkey> {
  const response = await fetch(`${API_URL}/v1/monkeys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monkey),
  });

  if (!response.ok) {
    throw new Error('Failed to create monkey');
  }
  return response.json();
}

export async function deleteMonkey(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/v1/monkeys/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete monkey');
  }
}

export async function updateMonkey(
  id: number,
  data: MonkeyForm
): Promise<void> {
  const response = await fetch(`${API_URL}/v1/monkeys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to edit monkey');
  }
}

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${API_URL}/v1/monkeys/locations`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return response.json();
}

export async function createLocation(data: LocationForm): Promise<Location> {
  const response = await fetch(`${API_URL}/v1/monkeys/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create location');
  }
  return response.json();
}

export async function deleteLocation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/v1/monkeys/locations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete location');
  }
}

export async function updateLocation(
  id: number,
  data: LocationForm
): Promise<void> {
  const response = await fetch(`${API_URL}/v1/monkeys/locations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to edit location');
  }
}

export async function getRoutes(sourceLocationId: number): Promise<Route[]> {
  const response = await fetch(
    `${API_URL}/v1/monkeys/routes/${sourceLocationId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch routes');
  }
  return response.json();
}

export async function createRoute(data: RouteForm): Promise<Route> {
  const response = await fetch(`${API_URL}/v1/monkeys/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create route');
  }
  return response.json();
}

export async function deleteRoute({
  startId,
  destinationId,
}: {
  startId: number;
  destinationId: number;
}): Promise<void> {
  const response = await fetch(
    `${API_URL}/v1/monkeys/routes/${startId}/${destinationId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete route');
  }
}

export async function updateRoute(id: number, data: RouteForm): Promise<void> {
  const payload: Route = {
    id: id,
    ...data,
  };
  const response = await fetch(`${API_URL}/v1/monkeys/routes`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to edit route');
  }
}
