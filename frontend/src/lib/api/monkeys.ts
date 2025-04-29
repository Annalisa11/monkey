import { API_URL } from '@/constants';
import type { CreateMonkey, Location, LocationForm, Monkey } from '@validation';

export async function getMonkeys(): Promise<Monkey[]> {
  const response = await fetch(`${API_URL}/v1/monkeys`);
  if (!response.ok) {
    throw new Error('Failed to fetch monkeys');
  }
  return response.json();
}

export async function createMonkey(monkey: CreateMonkey): Promise<Monkey> {
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
  data: CreateMonkey
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
