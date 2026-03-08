import { useMemo, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import { statusLabels } from '../utils/helpers';
import { TaskStatus } from '../utils/types';

const SprintBoardPage = () => {
  const { members, tasks } = useAppContext();
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');

  const activeTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const byDone = task.status !== 'done';
        const byMember = selectedMemberId === 'all' ? true : task.assigneeId === selectedMemberId;
        const query = `${task.id} ${task.title} ${task.subtitle}`.toLowerCase();
        const bySearch = search.trim() ? query.includes(search.trim().toLowerCase()) : true;
        return byDone && byMember && bySearch;
      }),
    [search, selectedMemberId, tasks]
  );

  const columns: TaskStatus[] = ['backlog', 'todo', 'inProgress'];

  return (
    <section>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Активный спринт</p>
          <h2>Канбан-доска</h2>
        </div>
        <input className="search-input" placeholder="Найти задачу по ID или названию" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="member-filter mb-24">
        <button type="button" className={selectedMemberId === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId('all')}>
          Все участники
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

      <div className="kanban-grid">
        {columns.map((column) => {
          const columnTasks = activeTasks.filter((task) => task.status === column);

          return (
            <div className="kanban-column" key={column}>
              <div className="kanban-title">
                <h3>{statusLabels[column]}</h3>
                <span>{columnTasks.length}</span>
              </div>
              <div className="stack-list">
                {columnTasks.length > 0 ? columnTasks.map((task) => <TaskCard key={task.id} task={task} showStatusActions />) : <p className="field-hint">Нет задач в колонке.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SprintBoardPage;
