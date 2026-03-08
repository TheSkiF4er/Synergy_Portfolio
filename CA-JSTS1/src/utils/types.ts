export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';

export interface TeamMember {
  id: string;
  fullName: string;
  position: string;
  department: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  durationDays: number;
  startDate: string;
  endDate: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  authorId: string;
  assigneeId: string;
  estimateHours: number;
  description: string;
  comments?: string;
  watchers: string[];
  status: TaskStatus;
  sprintId: string;
  createdAt: string;
}
