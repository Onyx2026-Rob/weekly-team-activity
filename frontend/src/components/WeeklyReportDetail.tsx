import React, { useState } from 'react';
import { WeeklyReport, Activity } from '../api/types';
import { createActivity, deleteActivity } from '../api/activities';
import { formatWeekRange } from '../utils/dateUtils';
import ActivityList from './ActivityList';
import ActivityForm from './ActivityForm';
import { CreateActivityPayload } from '../api/types';

interface Props {
  report: WeeklyReport;
  onReportUpdated: (report: WeeklyReport) => void;
}

const WeeklyReportDetail: React.FC<Props> = ({ report, onReportUpdated }) => {
  const [showForm, setShowForm] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(report.activities);

  React.useEffect(() => {
    setActivities(report.activities);
    setShowForm(false);
  }, [report.id, report.activities]);

  const handleAddActivity = async (payload: CreateActivityPayload) => {
    const newActivity = await createActivity(report.id, payload);
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    onReportUpdated({ ...report, activities: updatedActivities });
    setShowForm(false);
  };

  const handleDeleteActivity = async (id: number) => {
    await deleteActivity(id);
    const updatedActivities = activities.filter((a) => a.id !== id);
    setActivities(updatedActivities);
    onReportUpdated({ ...report, activities: updatedActivities });
  };

  return (
    <div className="weekly-report-detail">
      <h2>Week of {formatWeekRange(report.weekStartDate)}</h2>
      {showForm ? (
        <ActivityForm
          onSubmit={handleAddActivity}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <ActivityList
          activities={activities}
          onDelete={handleDeleteActivity}
          onAddClick={() => setShowForm(true)}
        />
      )}
    </div>
  );
};

export default WeeklyReportDetail;
