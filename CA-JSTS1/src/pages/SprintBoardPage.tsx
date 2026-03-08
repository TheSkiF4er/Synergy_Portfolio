import { useMemo, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import { statusLabels } from '../utils/helpers';
import { TaskStatus } from '../utils/types';

const SprintBoardPage = () => {
  const { members, tasks } = useAppContext();
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'done' && (selectedMemberId === 'all' ? true : task.assigneeId === selectedMemberId)),
    [selectedMemberId, tasks]
  );

  const columns: TaskStatus[] = ['backlog', 'todo', 'inProgress'];

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Активный спринт</p>
          <h2>Канбан-доска</h2>
        </div>
      </div>

      <div className="member-filter mb-24">
        <button className={selectedMemberId === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId('all')}>
          Все участники
        </button>
        {members.map((member) => (
          <button
            key={member.id}
            className={selectedMemberId === member.id ? 'chip active' : 'chip'}
            onClick={() => setSelectedMemberId(member.id)}
          >
            {member.fullName}
          </button>
        ))}
      </div>

      <div className="kanban-grid">
        {columns.map((column) => (
          <div className="kanban-column" key={column}>
            <div className="kanban-title">
              <h3>{statusLabels[column]}</h3>
              <span>{activeTasks.filter((task) => task.status === column).length}</span>
            </div>
            <div className="stack-list">
              {activeTasks.filter((task) => task.status === column).map((task) => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SprintBoardPage;
