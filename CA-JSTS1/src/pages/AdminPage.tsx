import { FormEvent, useMemo, useState } from 'react';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import { useAppContext } from '../context/AppContext';
import { calculateSprintDuration, formatEstimate, generateTaskId, getSprintRemainingHours } from '../utils/helpers';
import { Sprint, Task, TeamMember } from '../utils/types';

const AdminPage = () => {
  const { members, sprint, tasks, addMember, saveSprint, addTask } = useAppContext();

  const [memberForm, setMemberForm] = useState({ fullName: '', position: '', department: '' });
  const [sprintForm, setSprintForm] = useState<Sprint>(
    sprint || {
      id: 'sprint-new',
      name: '',
      goal: '',
      durationDays: 0,
      startDate: '',
      endDate: ''
    }
  );
  const [taskForm, setTaskForm] = useState({
    title: '',
    subtitle: '',
    authorId: members[0]?.id || '',
    assigneeId: members[0]?.id || '',
    estimateHours: 1,
    description: '',
    comments: '',
    watchers: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const remainingHours = useMemo(() => getSprintRemainingHours(sprint, tasks), [sprint, tasks]);
  const projectedRemainingHours = remainingHours - Number(taskForm.estimateHours || 0);

  const saveMember = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (memberForm.fullName.trim().length < 5) nextErrors.memberFullName = 'Укажите ФИО полностью';
    if (!memberForm.position.trim()) nextErrors.memberPosition = 'Укажите должность';
    if (!memberForm.department.trim()) nextErrors.memberDepartment = 'Укажите подразделение';

    setErrors((current) => ({ ...current, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0) return;

    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      fullName: memberForm.fullName,
      position: memberForm.position,
      department: memberForm.department
    };

    addMember(newMember);
    setMemberForm({ fullName: '', position: '', department: '' });
    setMessage('Участник успешно добавлен.');
  };

  const saveSprintHandler = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const duration = calculateSprintDuration(sprintForm.startDate, sprintForm.endDate);

    if (!sprintForm.name.trim()) nextErrors.sprintName = 'Укажите имя спринта';
    if (!sprintForm.goal.trim()) nextErrors.sprintGoal = 'Укажите цель спринта';
    if (!sprintForm.startDate || !sprintForm.endDate) nextErrors.sprintDates = 'Укажите даты начала и окончания';
    if (duration <= 0) nextErrors.sprintDates = 'Дата окончания должна быть позже или равна дате начала';

    setErrors((current) => ({ ...current, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0) return;

    saveSprint({ ...sprintForm, id: sprint?.id || 'sprint-1', durationDays: duration });
    setSprintForm((current) => ({ ...current, durationDays: duration }));
    setMessage('Спринт сохранен.');
  };

  const saveTaskHandler = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const estimate = Number(taskForm.estimateHours);

    if (!taskForm.title.trim()) nextErrors.title = 'Укажите заголовок';
    if (!taskForm.subtitle.trim()) nextErrors.subtitle = 'Укажите подзаголовок';
    if (!taskForm.authorId) nextErrors.authorId = 'Выберите автора';
    if (!taskForm.assigneeId) nextErrors.assigneeId = 'Выберите исполнителя';
    if (!estimate || estimate <= 0) nextErrors.estimateHours = 'Укажите корректную оценку в часах';
    if (taskForm.description.trim().length < 40) nextErrors.description = 'Описание должно быть не менее 40 символов';
    if (taskForm.comments.trim() && taskForm.comments.trim().length < 40) nextErrors.comments = 'Комментарий должен быть не менее 40 символов';
    if (!sprint) nextErrors.sprint = 'Сначала создайте спринт';
    if (projectedRemainingHours < 0) nextErrors.estimateHours = 'На эту задачу не хватает времени в текущем спринте';

    setErrors((current) => ({ ...current, ...nextErrors }));

    if (Object.keys(nextErrors).length > 0 || !sprint) return;

    const newTask: Task = {
      id: generateTaskId(tasks),
      title: taskForm.title,
      subtitle: taskForm.subtitle,
      authorId: taskForm.authorId,
      assigneeId: taskForm.assigneeId,
      estimateHours: estimate,
      description: taskForm.description,
      comments: taskForm.comments || undefined,
      watchers: taskForm.watchers
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((watcherName) => members.find((member) => member.fullName === watcherName)?.id)
        .filter((id): id is string => Boolean(id)),
      status: 'todo',
      sprintId: sprint.id,
      createdAt: new Date().toISOString()
    };

    addTask(newTask);
    setTaskForm({
      title: '',
      subtitle: '',
      authorId: members[0]?.id || '',
      assigneeId: members[0]?.id || '',
      estimateHours: 1,
      description: '',
      comments: '',
      watchers: ''
    });
    setMessage(`Задача ${newTask.id} успешно создана.`);
  };

  const memberOptions = [{ value: '', label: 'Выберите участника' }, ...members.map((member) => ({ value: member.id, label: member.fullName }))];

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Панель администратора</p>
          <h2>Управление спринтом, задачами и командой</h2>
        </div>
      </div>

      {message ? <div className="notice">{message}</div> : null}

      <div className="cards-grid cards-grid-2">
        <form className="panel" onSubmit={saveSprintHandler}>
          <h3>Добавление спринта</h3>
          <FormField label="Имя спринта" value={sprintForm.name} onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })} error={errors.sprintName} />
          <FormField as="textarea" label="Цель спринта" value={sprintForm.goal} onChange={(e) => setSprintForm({ ...sprintForm, goal: e.target.value })} error={errors.sprintGoal} />
          <div className="inline-grid">
            <FormField label="Дата начала" type="date" value={sprintForm.startDate} onChange={(e) => setSprintForm({ ...sprintForm, startDate: e.target.value, durationDays: calculateSprintDuration(e.target.value, sprintForm.endDate) })} error={errors.sprintDates} />
            <FormField label="Дата окончания" type="date" value={sprintForm.endDate} onChange={(e) => setSprintForm({ ...sprintForm, endDate: e.target.value, durationDays: calculateSprintDuration(sprintForm.startDate, e.target.value) })} error={errors.sprintDates} />
          </div>
          <FormField label="Длительность" value={String(calculateSprintDuration(sprintForm.startDate, sprintForm.endDate) || sprintForm.durationDays || 0)} readOnly hint="Считается автоматически по датам" />
          <button className="primary-button" type="submit">Сохранить спринт</button>
        </form>

        <form className="panel" onSubmit={saveMember}>
          <h3>Добавление участника</h3>
          <FormField label="ФИО" value={memberForm.fullName} onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })} error={errors.memberFullName} />
          <FormField label="Должность" value={memberForm.position} onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })} error={errors.memberPosition} />
          <FormField label="Подразделение" value={memberForm.department} onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })} error={errors.memberDepartment} />
          <button className="primary-button" type="submit">Добавить участника</button>
        </form>
      </div>

      <form className="panel mt-24" onSubmit={saveTaskHandler}>
        <div className="page-header compact">
          <div>
            <h3>Создание задачи</h3>
            <p className="field-hint">ID задачи генерируется автоматически в формате XX-1234.</p>
          </div>
          <div className="info-card compact">
            <span>Останется в спринте после добавления</span>
            <strong>{projectedRemainingHours >= 0 ? formatEstimate(projectedRemainingHours) : 'Недостаточно времени'}</strong>
          </div>
        </div>

        <div className="inline-grid">
          <FormField label="Заголовок" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} error={errors.title} />
          <FormField label="Подзаголовок" value={taskForm.subtitle} onChange={(e) => setTaskForm({ ...taskForm, subtitle: e.target.value })} error={errors.subtitle} />
        </div>

        <div className="inline-grid triple">
          <SelectField label="Автор" value={taskForm.authorId} onChange={(value) => setTaskForm({ ...taskForm, authorId: value })} options={memberOptions} error={errors.authorId} />
          <SelectField label="Исполнитель" value={taskForm.assigneeId} onChange={(value) => setTaskForm({ ...taskForm, assigneeId: value })} options={memberOptions} error={errors.assigneeId} />
          <FormField label="Время выполнения, часы" type="number" min={1} value={taskForm.estimateHours} onChange={(e) => setTaskForm({ ...taskForm, estimateHours: Number(e.target.value) })} error={errors.estimateHours} hint={`Формат отображения: ${formatEstimate(Number(taskForm.estimateHours || 0))}`} />
        </div>

        <FormField as="textarea" label="Описание задачи" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} error={errors.description} hint="Минимум 40 символов" />
        <FormField as="textarea" label="Дополнительные комментарии" value={taskForm.comments} onChange={(e) => setTaskForm({ ...taskForm, comments: e.target.value })} error={errors.comments} hint="Если заполняется, то минимум 40 символов" />
        <FormField label="Наблюдатели" value={taskForm.watchers} onChange={(e) => setTaskForm({ ...taskForm, watchers: e.target.value })} hint="Введите ФИО через запятую" />

        {errors.sprint ? <p className="field-error">{errors.sprint}</p> : null}
        <button className="primary-button" type="submit">Создать задачу</button>
      </form>
    </section>
  );
};

export default AdminPage;
