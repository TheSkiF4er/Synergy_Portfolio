import { useMemo, useState } from 'react';
import StatsChart from '../components/StatsChart';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import { formatDateRange, formatEstimate, getProgressPercent, getSprintRemainingHours, getTaskLoadByMember } from '../utils/helpers';

const DashboardPage = () => {
  const { members, sprint, tasks } = useAppContext();
  const [activeTab, setActiveTab] = useState<'product' | 'backlog'>('product');
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const byTab = activeTab === 'product' ? task.status !== 'backlog' : task.status === 'backlog';
      const byMember = selectedMemberId === 'all' ? true : task.assigneeId === selectedMemberId;
      const query = `${task.id} ${task.title} ${task.subtitle} ${task.description}`.toLowerCase();
      const bySearch = search.trim() ? query.includes(search.trim().toLowerCase()) : true;
      return byTab && byMember && bySearch;
    });
  }, [activeTab, search, selectedMemberId, tasks]);

  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const totalCount = tasks.length;
  const progress = getProgressPercent(completedCount, totalCount);
  const remainingHours = getSprintRemainingHours(sprint, tasks);
  const activeCount = tasks.filter((task) => task.status === 'inProgress').length;
  const chartData = getTaskLoadByMember(tasks, members);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Рабочий стол</p>
          <h2>Общая картина спринта</h2>
        </div>
        {sprint ? (
          <div className="sprint-badge">
            <strong>{sprint.name}</strong>
            <span>{formatDateRange(sprint.startDate, sprint.endDate)}</span>
          </div>
        ) : null}
      </div>

      <div className="cards-grid cards-grid-4">
        <article className="info-card">
          <span>Выполнено задач</span>
          <strong>{completedCount} / {totalCount}</strong>
        </article>
        <article className="info-card">
          <span>Прогресс спринта</span>
          <strong>{progress}%</strong>
          <div className="progress-bar"><div style={{ width: `${progress}%` }} /></div>
        </article>
        <article className="info-card">
          <span>В активной работе</span>
          <strong>{activeCount}</strong>
        </article>
        <article className="info-card">
          <span>Осталось времени</span>
          <strong>{formatEstimate(Math.max(remainingHours, 0))}</strong>
        </article>
      </div>

      <div className="cards-grid cards-grid-2 mb-24">
        <article className="info-card">
          <span>Цель спринта</span>
          <strong>{sprint?.goal || 'Спринт не создан'}</strong>
        </article>
        <article className="info-card">
          <span>Команда</span>
          <strong>{members.length} участников</strong>
          <span className="field-hint">Отслеживайте загрузку и прогресс по каждому исполнителю.</span>
        </article>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="tabs">
            <button type="button" className={activeTab === 'product' ? 'tab active' : 'tab'} onClick={() => setActiveTab('product')}>
              Product
            </button>
            <button type="button" className={activeTab === 'backlog' ? 'tab active' : 'tab'} onClick={() => setActiveTab('backlog')}>
              Backlog
            </button>
          </div>
          <input className="search-input" placeholder="Поиск по задачам" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        <div className="member-filter mb-24">
          <button type="button" className={selectedMemberId === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId('all')}>
            Вся команда
          </button>
          {members.map((member) => (
            <button
              type="button"
              key={member.id}
              className={selectedMemberId === member.id ? 'chip active' : 'chip'}
              onClick={() => setSelectedMemberId(member.id)}
            >
              {member.fullName}
            </button>
          ))}
        </div>

        <div className="cards-grid cards-grid-2">
          <div>
            <h3>Задачи</h3>
            <div className="stack-list">
              {filteredTasks.length > 0 ? filteredTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>Нет задач по выбранному фильтру.</p>}
            </div>
          </div>
          <div>
            <h3>Текущая загрузка команды</h3>
            <StatsChart items={chartData} metricLabel="ч" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
