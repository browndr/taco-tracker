import Dexie, { type EntityTable } from 'dexie';

interface User {
  id: number;
  name: string;
  password?: string; // Optional for existing users, required for new
}

interface Topping {
  id: number;
  name: string;
}

interface Taco {
  id: number;
  userId: number;
  date: string; // ISO string
  toppingIds: number[];
  notes?: string;
  rating?: number;
}

const db = new Dexie('TacoTrackerDB') as Dexie & {
  users: EntityTable<User, 'id'>;
  toppings: EntityTable<Topping, 'id'>;
  tacos: EntityTable<Taco, 'id'>;
};

db.version(2).stores({
  users: '++id, &name', // Schema didn't change structurally, but we're adding a field
  toppings: '++id, &name',
  tacos: '++id, userId, date, *toppingIds'
});

// Seed initial data if needed
db.on('populate', async () => {
  await db.toppings.bulkAdd([
    { name: 'Cilantro' },
    { name: 'Onion' },
    { name: 'Salsa Verde' },
    { name: 'Salsa Roja' },
    { name: 'Guacamole' },
    { name: 'Lime' },
    { name: 'Radish' },
    { name: 'Cheese' },
    { name: 'Sour Cream' }
  ]);
});

export { db };
export type { User, Topping, Taco };
