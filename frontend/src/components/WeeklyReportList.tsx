import React from 'react';
import { WeeklyReport } from '../api/types';
import { formatWeekRange } from '../utils/dateUtils';

interface Props {
  reports: WeeklyReport[];
  selectedReportId: number | null;
  onSelect: (report: WeeklyReport) => void;
  currentWeekStart: string;
  onCreateCurrentWeek: () => void;
}

const WeeklyReportList: React.FC<Props> = ({
  reports,
  selectedReportId,
  onSelect,
  currentWeekStart,
  onCreateCurrentWeek,
}) => {
  const hasCurrentWeek = reports.some(
    (r) => r.weekStartDate === currentWeekStart,
  );

  return (
    <div className="weekly-report-list">
      <div className="list-header">
        <h2>Weekly Reports</h2>
        {!hasCurrentWeek && (
          <button className="btn btn-primary" onClick={onCreateCurrentWeek}>
            + Start Current Week
          </button>
        )}
      </div>
      {reports.length === 0 ? (
        <p className="empty-state">No reports yet. Start the current week to begin.</p>
      ) : (
        <ul className="report-list">
          {reports.map((report) => (
            <li
              key={report.id}
              className={`report-item${selectedReportId === report.id ? ' active' : ''}`}
              onClick={() => onSelect(report)}
            >
              <span className="week-label">
                {formatWeekRange(report.weekStartDate)}
              </span>
              {report.weekStartDate === currentWeekStart && (
                <span className="badge current">Current Week</span>
              )}
              <span className="activity-count">
                {report.activities?.length ?? 0} activities
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeeklyReportList;
