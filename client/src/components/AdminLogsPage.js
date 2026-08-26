import React, { useCallback, useEffect, useMemo, useState } from "react";
import { API } from "../config/api";
import { http } from "../config/http";

/**
 * AdminLogsPage — журнал действий (пункт 8).
 *
 * Было:
 *   const API_BASE = "http://localhost:3000";  // без /api
 *   axios.get(`${API_BASE}/api/logs`, ...)     // → /api/logs
 *
 * Стало:
 *   http.get(API.logs, { params })             // baseURL .../api + /logs
 *
 * Важно: не писать /api/logs при baseURL уже с /api — иначе /api/api/logs.
 *
 * Проверить (/management/userlog):
 *   GET /api/logs?limit=&offset=&search=... + Authorization Bearer
 */
const INITIAL_FILTERS = {
  search: "",
  status: "",
  action: "",
  resourceType: "",
  userId: "",
  dateFrom: "",
  dateTo: "",
};

function statusBadgeClass(status) {
  const s = (status || "").toString().toLowerCase();
  if (s === "success") return "lab-admin-logs__badge lab-admin-logs__badge--success";
  if (s === "failed" || s === "error") return "lab-admin-logs__badge lab-admin-logs__badge--failed";
  if (s === "pending") return "lab-admin-logs__badge lab-admin-logs__badge--pending";
  return "lab-admin-logs__badge lab-admin-logs__badge--neutral";
}

function buildCsvRows(logs) {
  const headers = ["id", "timestamp", "user", "email", "action", "resource_id", "resource_type", "description", "ip", "user_agent", "session_id", "status"];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const log of logs) {
    const row = [
      log.id,
      log.timestamp,
      log.user?.name ?? "",
      log.user?.email ?? "",
      log.action ?? "",
      log.resource_id ?? "",
      log.resource_type ?? "",
      log.description ?? "",
      log.ip_address ?? "",
      log.user_agent ?? "",
      log.session_id ?? "",
      log.status ?? "",
    ].map(escape);
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [page, setPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalLogs / logsPerPage)), [totalLogs, logsPerPage]);

  const fetchLogs = useCallback(async () => {
    setError(null);
    setLoading(true);
    const offset = (page - 1) * logsPerPage;
    try {
      const response = await http.get(API.logs, {
        params: {
          limit: logsPerPage,
          offset,
          search: appliedFilters.search,
          status: appliedFilters.status,
          action: appliedFilters.action,
          resourceType: appliedFilters.resourceType,
          userId: appliedFilters.userId,
          dateFrom: appliedFilters.dateFrom,
          dateTo: appliedFilters.dateTo,
        },
      });
      setLogs(Array.isArray(response.data.logs) ? response.data.logs : []);
      setTotalLogs(typeof response.data.totalLogs === "number" ? response.data.totalLogs : 0);
      setLastFetchedAt(new Date());
    } catch (err) {
      console.error("Failed to load logs:", err);
      setLogs([]);
      setTotalLogs(0);
      setError(err.response?.data?.error || err.message || "Could not load logs");
    } finally {
      setLoading(false);
    }
  }, [page, logsPerPage, appliedFilters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setExpandedId(null);
  }, [page, appliedFilters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const handleDraftChange = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (e) => {
    e?.preventDefault();
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  };

  const resetFilters = () => {
    setDraftFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const exportCsv = () => {
    if (!logs.length) return;
    const csv = buildCsvRows(logs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="lab-admin-logs container-fluid px-3 px-md-4">
      <header className="lab-admin-logs__header">
        <h1>User activity log</h1>
        <p>
          Audit trail across authentication and key lab actions. Filter by action pattern, resource type, user id, status, and date range. Export applies to the
          current page only; increase page size before export if you need more rows.
        </p>
      </header>

      <form className="lab-admin-logs__toolbar" onSubmit={applyFilters} noValidate>
        <div className="lab-admin-logs__field lab-admin-logs__field--grow">
          <label htmlFor="log-search">Search</label>
          <input
            id="log-search"
            type="search"
            placeholder="Action, type, description, IP…"
            value={draftFilters.search}
            onChange={(e) => handleDraftChange("search", e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-status">Status</label>
          <select id="log-status" value={draftFilters.status} onChange={(e) => handleDraftChange("status", e.target.value)}>
            <option value="">Any</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-action">Action</label>
          <input
            id="log-action"
            type="text"
            placeholder="e.g. LOGIN"
            value={draftFilters.action}
            onChange={(e) => handleDraftChange("action", e.target.value)}
          />
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-res-type">Resource type</label>
          <input
            id="log-res-type"
            type="text"
            placeholder="User, Task…"
            value={draftFilters.resourceType}
            onChange={(e) => handleDraftChange("resourceType", e.target.value)}
          />
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-user">User id</label>
          <input
            id="log-user"
            type="number"
            min="1"
            placeholder="ID"
            value={draftFilters.userId}
            onChange={(e) => handleDraftChange("userId", e.target.value)}
          />
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-from">From</label>
          <input id="log-from" type="date" value={draftFilters.dateFrom} onChange={(e) => handleDraftChange("dateFrom", e.target.value)} />
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-to">To</label>
          <input id="log-to" type="date" value={draftFilters.dateTo} onChange={(e) => handleDraftChange("dateTo", e.target.value)} />
        </div>
        <div className="lab-admin-logs__field lab-admin-logs__field--narrow">
          <label htmlFor="log-page-size">Page size</label>
          <select id="log-page-size" value={logsPerPage} onChange={(e) => setLogsPerPage(Number(e.target.value) || 10)}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="lab-admin-logs__actions">
          <button type="submit" className="lab-admin-logs__btn lab-admin-logs__btn--primary">
            Apply filters
          </button>
          <button type="button" className="lab-admin-logs__btn" onClick={resetFilters}>
            Reset
          </button>
          <button type="button" className="lab-admin-logs__btn" onClick={() => fetchLogs()} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="lab-admin-logs__btn" onClick={exportCsv} disabled={!logs.length}>
            Export CSV
          </button>
        </div>
      </form>

      <div className="lab-admin-logs__meta">
        <span>
          Total entries: <strong>{totalLogs}</strong>
        </span>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        {lastFetchedAt ? (
          <span className="lab-admin-logs__cell--muted">Updated {lastFetchedAt.toLocaleTimeString()}</span>
        ) : null}
      </div>

      {error ? <div className="lab-admin-logs__error">{error}</div> : null}

      {loading ? (
        <div className="lab-admin-logs__loading" aria-live="polite">
          <span className="lab-admin-logs__spinner" aria-hidden />
          Loading…
        </div>
      ) : null}

      <div className="lab-admin-logs__table-wrap">
        <table className="lab-admin-logs__table">
          <thead>
            <tr>
              <th>When</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Description</th>
              <th>IP</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="lab-admin-logs__empty">
                  No log rows match the current filters.
                </td>
              </tr>
            ) : null}
            {logs.map((log) => (
                <tr key={log.id}>
                  <td className="lab-admin-logs__cell--mono">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}</td>
                  <td>
                    <div>{log.user?.name || "—"}</div>
                    {log.user?.email ? <div className="lab-admin-logs__cell--muted">{log.user.email}</div> : null}
                  </td>
                  <td className="lab-admin-logs__cell--mono">{log.action}</td>
                  <td>
                    {log.resource_type || "—"}
                    {log.resource_id != null ? ` #${log.resource_id}` : ""}
                  </td>
                  <td>
                    <div className="lab-admin-logs__cell--muted" title={log.description || ""}>
                      {log.description ? (log.description.length > 80 ? `${log.description.slice(0, 80)}…` : log.description) : "—"}
                    </div>
                    {(log.user_agent || log.session_id) && (
                      <button
                        type="button"
                        className="lab-admin-logs__row-expand-btn"
                        onClick={() => setExpandedId((id) => (id === log.id ? null : log.id))}
                      >
                        {expandedId === log.id ? "Hide client details" : "Client details"}
                      </button>
                    )}
                    {expandedId === log.id ? (
                      <pre className="lab-admin-logs__row-detail">
                        {log.user_agent ? `UA: ${log.user_agent}\n` : ""}
                        {log.session_id ? `Session: ${log.session_id}` : ""}
                      </pre>
                    ) : null}
                  </td>
                  <td className="lab-admin-logs__cell--mono lab-admin-logs__cell--muted">{log.ip_address || "—"}</td>
                  <td>
                    <span className={statusBadgeClass(log.status)}>{log.status || "—"}</span>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lab-admin-logs__pagination">
        <span className="lab-admin-logs__cell--muted">
          {totalLogs === 0
            ? "No rows on this page"
            : `Showing ${(page - 1) * logsPerPage + 1}–${Math.min(page * logsPerPage, totalLogs)} of ${totalLogs}`}
        </span>
        <nav aria-label="Log pagination">
          <button
            type="button"
            className="lab-admin-logs__btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <button
            type="button"
            className="lab-admin-logs__btn"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
}

export default AdminLogsPage;
