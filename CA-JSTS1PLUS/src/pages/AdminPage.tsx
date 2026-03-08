import { FormEvent, useEffect, useMemo, useState } from 'react';
import FormField from '../components/FormField';
import MultiSelectChips from '../components/MultiSelectChips';
import SelectField from '../components/SelectField';
import { useAppContext } from '../context/AppContext';
import { calculateSprintDuration, formatEstimate, generateTaskId, getSprintRemainingHours } from '../utils/helpers';
import { Sprint, Task, TeamMember } from '../utils/types';

const emptySprint: Sprint = {
  id: 'sprint-new',
  name: '',
  goal: '',
  durationDays: 0,
  startDate: '',
  endDate: ''
};

const AdminPage = () => {
  const { members, sprint, tasks, addMember, saveSprint, addTask, resetDemoData } = useAppContext();

  const [memberForm, setMemberForm] = useState({ fullName: '', position: '', department: '' });
  const [sprintForm, setSprintForm] = useState<Sprint>(sprint || emptySprint);
  const [taskForm, setTaskForm] = useState({
    title: '',
    subtitle: '',
    authorId: members[0]?.id || '',
    assigneeId: members[0]?.id || '',
    estimateHours: 1,
    description: '',
    comments: '',
    watchers: [] as string[]
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!taskForm.authorId && members[0]?.id) {
      setTaskForm((current) => ({ ...current, authorId: members[0].id, assigneeId: current.assigneeId || members[0].id }));
    }
  }, [members, taskForm.authorId]);

  const remainingHours = useMemo(() => getSprintRemainingHours(sprint, tasks), [sprint, tasks]);
  const estimate = Number(taskForm.estimateHours || 0);
  const projectedRemainingHours = remainingHours - estimate;
  const memberOptions = [{ value: '', label: 'Выберите участника' }, ...members.map((member) => ({ value: member.id, label: member.fullName }))];
  const watcherOptions = members.map((member) => ({ value: member.id, label: member.fullName }));

  const patchErrors = (nextErrors: Record<string, string>) => {
    setErrors((current) => ({ ...current, ...nextErrors }));
  };

  const clearMessage = () => setMessage('');

  const saveMember = (event: FormEvent) => {
    event.preventDefault();
    clearMessage();
    const nextErrors: Record<string, string> = {
      memberFullName: '',
      memberPosition: '',
      memberDepartment: ''
    };

    if (memberForm.fullName.trim().length < 5) nextErrors.memberFullName = 'Укажите ФИО полностью';
    if (!memberForm.position.trim()) nextErrors.memberPosition = 'Укажите должность';
    if (!memberForm.department.trim()) nextErrors.memberDepartment = 'Укажите подразделение';
    if (members.some((member) => member.fullName.toLowerCase() === memberForm.fullName.trim().toLowerCase())) nextErrors.memberFullName = 'Такой участник уже существует';

    patchErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      fullName: memberForm.fullName.trim(),
      position: memberForm.position.trim(),
      department: memberForm.department.trim()
    };

    addMember(newMember);
    setMemberForm({ fullName: '', position: '', department: '' });
    setMessage('Участник успешно добавлен.');
  };

  const saveSprintHandler = (event: FormEvent) => {
    event.preventDefault();
    clearMessage();
    const duration = calculateSprintDuration(sprintForm.startDate, sprintForm.endDate);
    const nextErrors: Record<string, string> = {
      sprintName: '',
      sprintGoal: '',
      sprintDates: ''
    };

    if (!sprintForm.name.trim()) nextErrors.sprintName = 'Укажите имя спринта';
    if (!sprintForm.goal.trim()) nextErrors.sprintGoal = 'Укажите цель спринта';
    if (!sprintForm.startDate || !sprintForm.endDate) nextErrors.sprintDates = 'Укажите даты начала и окончания';
    if (duration <= 0) nextErrors.sprintDates = 'Дата окончания должна быть позже или равна дате начала';

    patchErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    saveSprint({ ...sprintForm, id: sprint?.id || 'sprint-1', durationDays: duration });
    setSprintForm((current) => ({ ...current, durationDays: duration }));
    setMessage('Спринт сохранён.');
  };

  const saveTaskHandler = (event: FormEvent) => {
    event.preventDefault();
    clearMessage();
    const nextErrors: Record<string, string> = {
      title: '',
      subtitle: '',
      authorId: '',
      assigneeId: '',
      estimateHours: '',
      description: '',
      comments: '',
      sprint: ''
    };

    if (!taskForm.title.trim()) nextErrors.title = 'Укажите заголовок';
    if (!taskForm.subtitle.trim()) nextErrors.subtitle = 'Укажите подзаголовок';
    if (!taskForm.authorId) nextErrors.authorId = 'Выберите автора';
    if (!taskForm.assigneeId) nextErrors.assigneeId = 'Выберите исполнителя';
    if (!estimate || estimate <= 0) nextErrors.estimateHours = 'Укажите корректную оценку в часах';
    if (taskForm.description.trim().length < 40) nextErrors.description = 'Описание должно быть не менее 40 символов';
    if (taskForm.comments.trim() && taskForm.comments.trim().length < 40) nextErrors.comments = 'Комментарий должен быть не менее 40 символов';
    if (!sprint) nextErrors.sprint = 'Сначала создайте спринт';
    if (projectedRemainingHours < 0) nextErrors.estimateHours = 'На эту задачу не хватает времени в текущем спринте';

    patchErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !sprint) return;

    const newTask: Task = {
      id: generateTaskId(tasks),
      title: taskForm.title.trim(),
      subtitle: taskForm.subtitle.trim(),
      authorId: taskForm.authorId,
      assigneeId: taskForm.assigneeId,
      estimateHours: estimate,
      description: taskForm.description.trim(),
      comments: taskForm.comments.trim() || undefined,
      watchers: taskForm.watchers,
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
      watchers: []
    });
    setMessage(`Задача ${newTask.id} успешно создана.`);
  };

  return (
    <section>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Панель администратора</p>
          <h2>Управление спринтом, задачами и командой</h2>
        </div>
        <button type="button" className="secondary-button" onClick={resetDemoData}>Сбросить демо-данные</button>
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
            <p className="field-hint">ID генерируется автоматически в формате XX-1234. Статус новой задачи — «К выполнению».</p>
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
          <FormField label="Время выполнения, часы" type="number" min={1} value={taskForm.estimateHours} onChange={(e) => setTaskForm({ ...taskForm, estimateHours: Number(e.target.value) })} error={errors.estimateHours} hint={`Будет показано как: ${formatEstimate(estimate)}`} />
        </div>

        <FormField as="textarea" label="Описание задачи" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} error={errors.description} hint="Минимум 40 символов" />
        <FormField as="textarea" label="Дополнительные комментарии" value={taskForm.comments} onChange={(e) => setTaskForm({ ...taskForm, comments: e.target.value })} error={errors.comments} hint="Если поле заполнено, то минимум 40 символов" />
        <MultiSelectChips label="Наблюдатели" options={watcherOptions} value={taskForm.watchers} onChange={(value) => setTaskForm({ ...taskForm, watchers: value })} hint="Выберите одного или нескольких наблюдателей" />

        {errors.sprint ? <p className="field-error">{errors.sprint}</p> : null}
        <button className="primary-button" type="submit">Создать задачу</button>
      </form>
    </section>
  );
};

export default AdminPage;
