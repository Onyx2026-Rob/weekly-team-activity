import React, { useEffect, useState, useCallback } from 'react';
import { Employee, WeeklyReport } from './api/types';
import { getEmployees } from './api/employees';
import { getWeeklyReports, findOrCreateWeeklyReport } from './api/weeklyReports';
import { getCurrentWeekStart } from './utils/dateUtils';
import EmployeeSelector from './components/EmployeeSelector';
import WeeklyReportList from './components/WeeklyReportList';
import WeeklyReportDetail from './components/WeeklyReportDetail';
import './App.css';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentWeekStart = getCurrentWeekStart();

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError('Failed to load employees.'));
  }, []);

  const loadReports = useCallback(async (employeeId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeeklyReports(employeeId);
      setReports(data);
      setSelectedReport(null);
    } catch {
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployeeId(id);
    loadReports(id);
  };

  const handleSelectReport = (report: WeeklyReport) => {
    setSelectedReport(report);
  };

  const handleCreateCurrentWeek = async () => {
    if (!selectedEmployeeId) return;
    setLoading(true);
    try {
      const report = await findOrCreateWeeklyReport(
        selectedEmployeeId,
        currentWeekStart,
      );
      const updatedReports = [
        report,
        ...reports.filter((r) => r.id !== report.id),
      ];
      setReports(updatedReports);
      setSelectedReport(report);
    } catch {
      setError('Failed to create weekly report.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportUpdated = (updatedReport: WeeklyReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updatedReport.id ? updatedReport : r)),
    );
    setSelectedReport(updatedReport);
  };

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weekly Team Activity Tracker</h1>
        {selectedEmployee && (
          <span className="selected-employee-badge">
            Viewing: {selectedEmployee.fullName}
          </span>
        )}
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <section className="sidebar">
          <EmployeeSelector
            employees={employees}
            selectedEmployeeId={selectedEmployeeId}
            onSelect={handleSelectEmployee}
          />

          {selectedEmployeeId !== null && (
            <>
              {loading ? (
                <div className="loading">Loading reports...</div>
              ) : (
                <WeeklyReportList
                  reports={reports}
                  selectedReportId={selectedReport?.id ?? null}
                  onSelect={handleSelectReport}
                  currentWeekStart={currentWeekStart}
                  onCreateCurrentWeek={handleCreateCurrentWeek}
                />
              )}
            </>
          )}
        </section>

        <section className="content">
          {!selectedEmployeeId ? (
            <div className="welcome">
              <h2>Welcome to Weekly Team Activity Tracker</h2>
              <p>Select an employee from the left to view their weekly reports.</p>
            </div>
          ) : !selectedReport ? (
            <div className="welcome">
              <p>Select a weekly report from the list to view activities.</p>
            </div>
          ) : (
            <WeeklyReportDetail
              report={selectedReport}
              onReportUpdated={handleReportUpdated}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
