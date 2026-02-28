import React, { useState } from 'react';
import { CreateActivityPayload } from '../api/types';

interface Props {
  onSubmit: (payload: CreateActivityPayload) => Promise<void>;
  onCancel: () => void;
}

const ActivityForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roadblocks, setRoadblocks] = useState('');
  const [percentComplete, setPercentComplete] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        roadblocks: roadblocks.trim() || undefined,
        percentComplete,
      });
    } catch (err: unknown) {
      setError('Failed to add activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>Add Activity</h3>
      {error && <div className="form-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you work on?"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label htmlFor="roadblocks">Roadblocks</label>
        <textarea
          id="roadblocks"
          value={roadblocks}
          onChange={(e) => setRoadblocks(e.target.value)}
          placeholder="Any blockers or impediments?"
          rows={2}
        />
      </div>
      <div className="form-group">
        <label htmlFor="percentComplete">
          % Complete: {percentComplete}%
        </label>
        <input
          id="percentComplete"
          type="range"
          min={0}
          max={100}
          value={percentComplete}
          onChange={(e) => setPercentComplete(Number(e.target.value))}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Activity'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
