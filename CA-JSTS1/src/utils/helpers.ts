import { Sprint, Task, TeamMember } from './types';

export const statusLabels: Record<Task['status'], string> = {
  backlog: 'Backlog',
  todo: 'К выполнению',
  inProgress: 'В работе',
  done: 'Готово'
};

export const calculateSprintDuration = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff < 0) {
    return 0;
  }

  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

export const formatEstimate = (hours: number): string => {
  const days = Math.floor(hours / 8);
  const restHours = hours % 8;

  if (days === 0) {
    return `${hours}ч`;
  }

  return restHours === 0 ? `${days}д` : `${days}д ${restHours}ч`;
};

export const generateTaskId = (tasks: Task[]): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const first = letters[Math.floor(Math.random() * letters.length)];
  const second = letters[Math.floor(Math.random() * letters.length)];

  let numeric = Math.floor(Math.random() * 9000) + 1000;
  const existingIds = new Set(tasks.map((task) => task.id));

  while (existingIds.has(`${first}${second}-${numeric}`)) {
    numeric = Math.floor(Math.random() * 9000) + 1000;
  }

  return `${first}${second}-${numeric}`;
};

export const getMemberName = (members: TeamMember[], id: string): string => {
  return members.find((member) => member.id === id)?.fullName || 'Не назначен';
};

export const getSprintRemainingHours = (sprint: Sprint | null, tasks: Task[]): number => {
  if (!sprint) {
    return 0;
  }

  const totalHours = sprint.durationDays * 8;
  const reservedHours = tasks
    .filter((task) => task.sprintId === sprint.id)
    .reduce((sum, task) => sum + task.estimateHours, 0);

  return totalHours - reservedHours;
};
