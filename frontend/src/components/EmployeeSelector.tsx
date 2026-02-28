import React from 'react';
import { Employee } from '../api/types';

interface Props {
  employees: Employee[];
  selectedEmployeeId: number | null;
  onSelect: (id: number) => void;
}

const EmployeeSelector: React.FC<Props> = ({
  employees,
  selectedEmployeeId,
  onSelect,
}) => {
  return (
    <div className="employee-selector">
      <h2>Select Employee</h2>
      <div className="employee-buttons">
        {employees.map((emp) => (
          <button
            key={emp.id}
            className={`employee-btn${selectedEmployeeId === emp.id ? ' active' : ''}`}
            onClick={() => onSelect(emp.id)}
          >
            {emp.fullName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSelector;
