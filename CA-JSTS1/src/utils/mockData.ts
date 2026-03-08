import { Sprint, Task, TeamMember } from './types';

export const initialMembers: TeamMember[] = [
  { id: 'u1', fullName: 'Иван Петров', position: 'Frontend Developer', department: 'Product Team' },
  { id: 'u2', fullName: 'Анна Смирнова', position: 'QA Engineer', department: 'Quality Assurance' },
  { id: 'u3', fullName: 'Дмитрий Орлов', position: 'Project Manager', department: 'Delivery' },
  { id: 'u4', fullName: 'Мария Соколова', position: 'UI/UX Designer', department: 'Design' }
];

export const initialSprint: Sprint = {
  id: 'sprint-1',
  name: 'Sprint Alpha',
  goal: 'Собрать MVP доски задач и статистики команды',
  durationDays: 10,
  startDate: '2026-03-02',
  endDate: '2026-03-13'
};

export const initialTasks: Task[] = [
  {
    id: 'FE-1204',
    title: 'Сверстать главную страницу',
    subtitle: 'Сделать вкладки Product и Backlog',
    authorId: 'u3',
    assigneeId: 'u1',
    estimateHours: 12,
    description: 'Подготовить адаптивную главную страницу со статистикой по задачам, текущему спринту и фильтрацией only my issues.',
    watchers: ['u4'],
    status: 'done',
    sprintId: 'sprint-1',
    createdAt: '2026-03-02T10:00:00.000Z'
  },
  {
    id: 'QA-2031',
    title: 'Проверить создание задач',
    subtitle: 'Покрыть валидации формы',
    authorId: 'u3',
    assigneeId: 'u2',
    estimateHours: 6,
    description: 'Проверить обязательные и необязательные поля формы, валидацию описания и комментариев, а также ограничение по времени спринта.',
    watchers: ['u1'],
    status: 'inProgress',
    sprintId: 'sprint-1',
    createdAt: '2026-03-03T09:30:00.000Z'
  },
  {
    id: 'DS-4017',
    title: 'Подготовить макет карточки',
    subtitle: 'Описать вид карточек на канбане',
    authorId: 'u4',
    assigneeId: 'u4',
    estimateHours: 8,
    description: 'Создать единый шаблон карточки задачи для доски активного спринта, предусмотреть показ автора, исполнителя и оценки по времени.',
    comments: 'Важно предусмотреть компактный вид для мобильных устройств и возможность отображения наблюдателей.',
    watchers: ['u1', 'u3'],
    status: 'todo',
    sprintId: 'sprint-1',
    createdAt: '2026-03-04T11:45:00.000Z'
  },
  {
    id: 'BE-5512',
    title: 'Подготовить backlog задач',
    subtitle: 'Заполнить product backlog для команды',
    authorId: 'u3',
    assigneeId: 'u3',
    estimateHours: 10,
    description: 'Собрать список задач следующего этапа, распределить их по приоритетам и отразить в отдельной вкладке backlog на главной странице.',
    watchers: ['u1', 'u2', 'u4'],
    status: 'backlog',
    sprintId: 'sprint-1',
    createdAt: '2026-03-04T13:20:00.000Z'
  }
];
