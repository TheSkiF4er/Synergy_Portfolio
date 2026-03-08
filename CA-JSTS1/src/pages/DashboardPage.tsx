import { useMemo, useState } from 'react';
import StatsChart from '../components/StatsChart';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import { formatEstimate, getMemberName, getSprintRemainingHours } from '../utils/helpers';

const DashboardPage = () => {
  const { members, sprint, tasks } = useAppContext();
  const [activeTab, setActiveTab] = useState<'product' | 'backlog'>('product');
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const byTab = activeTab === 'product' ? task.status === 'done' || task.status === 'inProgress' || task.status === 'todo' : task.status === 'backlog';
      const byMember = selectedMemberId === 'all' ? true : task.assigneeId === selectedMemberId;
      return byTab && byMember;
    });
  }, [activeTab, selectedMemberId, tasks]);

  const chartData = members.map((member) => ({
    label: member.fullName.split(' ')[0],
    value: tasks.filter((task) => task.assigneeId === member.id && task.status === 'done').length
  }));

  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const totalCount = tasks.length;
  const remainingHours = getSprintRemainingHours(sprint, tasks);

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
            <span>{sprint.startDate} — {sprint.endDate}</span>
          </div>
        ) : null}
      </div>

      <div className="cards-grid cards-grid-3">
        <article className="info-card">
          <span>Выполнено задач</span>
          <strong>{completedCount} / {totalCount}</strong>
        </article>
        <article className="info-card">
          <span>Цель спринта</span>
          <strong>{sprint?.goal || 'Спринт не создан'}</strong>
        </article>
        <article className="info-card">
          <span>Осталось времени</span>
          <strong>{formatEstimate(Math.max(remainingHours, 0))}</strong>
        </article>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="tabs">
            <button className={activeTab === 'product' ? 'tab active' : 'tab'} onClick={() => setActiveTab('product')}>
              Product
            </button>
            <button className={activeTab === 'backlog' ? 'tab active' : 'tab'} onClick={() => setActiveTab('backlog')}>
              Backlog
            </button>
          </div>
          <div className="member-filter">
            <button className={selectedMemberId === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId('all')}>
              Вся команда
            </button>
            {members.map((member) => (
              <button
                key={member.id}
                className={selectedMemberId === member.id ? 'chip active' : 'chip'}
                onClick={() => setSelectedMemberId(member.id)}
              >
                {getMemberName(members, member.id)}
              </button>
            ))}
          </div>
        </div>

        <div className="cards-grid cards-grid-2">
          <div>
            <h3>Задачи</h3>
            <div className="stack-list">
              {filteredTasks.length > 0 ? filteredTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>Нет задач по выбранному фильтру.</p>}
            </div>
          </div>
          <div>
            <h3>Статистика команды</h3>
            <StatsChart items={chartData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
