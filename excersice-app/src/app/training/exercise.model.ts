export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  status?: 'completed' | 'cancelled' | null;
  date?: Date | { seconds: number; nanoseconds: number };
}
