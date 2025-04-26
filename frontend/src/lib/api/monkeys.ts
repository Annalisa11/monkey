import { API_URL } from '@/constants';
import type { Monkey, MonkeyForm } from '@/lib/types';

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
