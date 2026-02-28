import React from 'react';
import { Activity } from '../api/types';

interface Props {
  activities: Activity[];
  onDelete: (id: number) => void;
  onAddClick: () => void;
}

const ActivityList: React.FC<Props> = ({ activities, onDelete, onAddClick }) => {
  return (
    <div className="activity-list-container">
      <div className="list-header">
        <h3>Activities</h3>
        <button className="btn btn-primary" onClick={onAddClick}>
          + Add Activity
        </button>
      </div>
      {activities.length === 0 ? (
        <p className="empty-state">No activities yet. Click "Add Activity" to get started.</p>
      ) : (
        <table className="activity-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Roadblocks</th>
              <th>% Complete</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="activity-title">{activity.title}</td>
                <td>{activity.description || '—'}</td>
                <td>{activity.roadblocks || '—'}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${activity.percentComplete}%` }}
                      />
                    </div>
                    <span>{activity.percentComplete}%</span>
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(activity.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityList;
