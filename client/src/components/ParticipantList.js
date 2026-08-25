import React, { Component } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
    FaFileExport,
} from 'react-icons/fa6';
import { formatDistanceToNow, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * ParticipantList — участники / сотрудники (пункт 6).
 *
 * Было: axios.get('http://localhost:3000/api/employees')
 * Стало: http.get(API.employees)
 *
 * Проверить (/members-teams/members): GET /api/employees + Bearer
 */

/** Table columns: extend this array and `renderCell` for new fields. */
const TABLE_COLUMNS = [
    { key: 'select', header: '', variant: 'select' },
    { key: 'participant', header: 'Participant', minWidth: '14rem' },
    { key: 'email', header: 'Email', minWidth: '11rem' },
    { key: 'position', header: 'Position', minWidth: '9rem' },
    { key: 'department', header: 'Department', minWidth: '9rem' },
    { key: 'specialization', header: 'Specialization', minWidth: '9rem' },
    { key: 'laboratory', header: 'Laboratory', minWidth: '9rem' },
    { key: 'lastActive', header: 'Last active', minWidth: '9rem' },
    { key: 'joined', header: 'Joined', minWidth: '8rem' },
];

function initialsFromName(name) {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

class ParticipantList extends Component {
    state = {
        employees: [],
        loading: true,
        error: null,
        searchQuery: '',
    };

    componentDidMount() {
        this.fetchEmployees();
    }

    fetchEmployees = async () => {
        this.setState({ loading: true, error: null });
        try {
            const response = await http.get(API.employees);
            this.setState({ employees: response.data, loading: false });
        } catch (err) {
            console.error('Ошибка при загрузке сотрудников:', err);
            this.setState({
                loading: false,
                error: 'Could not load participants. Check the connection and try again.',
            });
        }
    };

    formatLastActive = (date) => {
        if (!date) return '—';
        const parsedDate = new Date(date);
        const differenceInMs = Date.now() - parsedDate.getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        if (differenceInMs < oneDayInMs) {
            return formatDistanceToNow(parsedDate, { addSuffix: true, locale: enUS });
        }
        if (differenceInMs < oneDayInMs * 2) {
            return 'Yesterday';
        }
        return format(parsedDate, 'dd.MM.yyyy');
    };

    getFilteredEmployees = () => {
        const { employees, searchQuery } = this.state;
        const q = searchQuery.trim().toLowerCase();
        if (!q) return employees;

        return employees.filter((emp) => {
            const hay = [
                emp.name,
                emp.user?.email,
                emp.position,
                emp.department,
                emp.specialization,
                emp.laboratory?.lab_name,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return hay.includes(q);
        });
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    renderCell(columnKey, employee) {
        switch (columnKey) {
            case 'select':
                return (
                    <label className="d-flex m-0">
                        <input
                            type="checkbox"
                            className="participant-list__check form-check-input"
                            aria-label={`Select ${employee.name || 'participant'}`}
                        />
                    </label>
                );
            case 'participant':
                return (
                    <div className="participant-list__user">
                        <span className="participant-list__avatar" aria-hidden>
                            {initialsFromName(employee.name)}
                        </span>
                        <span className="participant-list__name" title={employee.name}>
                            {employee.name}
                        </span>
                    </div>
                );
            case 'email':
                return employee.user?.email || (
                    <span className="participant-list__muted">—</span>
                );
            case 'position':
            case 'department':
            case 'specialization':
                return employee[columnKey] || (
                    <span className="participant-list__muted">—</span>
                );
            case 'laboratory':
                return employee.laboratory?.lab_name || (
                    <span className="participant-list__muted">—</span>
                );
            case 'lastActive':
                return this.formatLastActive(employee.user?.updatedAt);
            case 'joined': {
                const created = employee.createdAt ? new Date(employee.createdAt) : null;
                if (!created || Number.isNaN(created.getTime())) {
                    return <span className="participant-list__muted">—</span>;
                }
                return (
                    <div className="participant-list__stack">
                        <span>{format(created, 'dd.MM.yyyy')}</span>
                        <time dateTime={created.toISOString()}>
                            {format(created, 'HH:mm')}
                        </time>
                    </div>
                );
            }
            default:
                return null;
        }
    }

    render() {
        const { loading, error, searchQuery, employees } = this.state;
        const filtered = this.getFilteredEmployees();
        const total = employees.length;

        return (
            <section className="participant-list" aria-labelledby="participant-list-heading">
                <div className="participant-list__shell">
                    <header className="participant-list__header">
                        <p className="participant-list__eyebrow">Members & Teams</p>
                        <div className="participant-list__title-row">
                            <h2 id="participant-list-heading" className="participant-list__title">
                                Participants
                                <span className="participant-list__count"> {total}</span>
                            </h2>
                        </div>
                        <p className="participant-list__subtitle">
                            Directory of lab members. Toolbar and table shell are ready to wire
                            export, add-participant flows, and server-side pagination.
                        </p>
                    </header>

                    <div className="participant-list__toolbar">
                        <div className="participant-list__toolbar-main">
                            <div className="participant-list__search">
                                <FaSearch className="participant-list__search-icon" aria-hidden />
                                <input
                                    type="search"
                                    className="participant-list__search-input"
                                    placeholder="Search by name, email, role…"
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    aria-label="Search participants"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="participant-list__actions">
                            <button type="button" className="participant-list__btn-ghost">
                                <FaFileExport aria-hidden />
                                <span>Export</span>
                            </button>
                            <button type="button" className="participant-list__btn-primary">
                                <FaPlus aria-hidden />
                                <span>Add participant</span>
                            </button>
                        </div>
                    </div>

                    <div className="participant-list__card">
                        {loading && (
                            <p className="participant-list__loading">Loading participants…</p>
                        )}
                        {!loading && error && (
                            <p className="participant-list__error" role="alert">
                                {error}
                            </p>
                        )}
                        {!loading && !error && filtered.length === 0 && (
                            <p className="participant-list__empty">
                                {searchQuery.trim()
                                    ? 'No participants match your search.'
                                    : 'No participants yet.'}
                            </p>
                        )}
                        {!loading && !error && filtered.length > 0 && (
                            <>
                                <div className="participant-list__table-scroll">
                                    <table className="participant-list__table">
                                        <thead className="participant-list__thead">
                                            <tr>
                                                {TABLE_COLUMNS.map((col) => (
                                                    <th
                                                        key={col.key}
                                                        scope="col"
                                                        className={
                                                            col.variant === 'select'
                                                                ? 'participant-list__th participant-list__th--select'
                                                                : 'participant-list__th'
                                                        }
                                                        style={
                                                            col.minWidth
                                                                ? { minWidth: col.minWidth }
                                                                : undefined
                                                        }
                                                    >
                                                        {col.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="participant-list__tbody">
                                            {filtered.map((employee) => (
                                                <tr key={employee.id} className="participant-list__tr">
                                                    {TABLE_COLUMNS.map((col) => (
                                                        <td
                                                            key={col.key}
                                                            className={
                                                                col.variant === 'select'
                                                                    ? 'participant-list__td participant-list__td--select'
                                                                    : 'participant-list__td'
                                                            }
                                                        >
                                                            {this.renderCell(col.key, employee)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <footer className="participant-list__footer">
                                    <p className="participant-list__summary">
                                        {filtered.length === total ? (
                                            <>
                                                Показано{' '}
                                                <strong>{filtered.length}</strong>
                                                <span className="participant-list__summary-muted">
                                                    {' '}
                                                    из {total}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                Показано{' '}
                                                <strong>{filtered.length}</strong>
                                                <span className="participant-list__summary-muted">
                                                    {' '}
                                                    из {total} (фильтр)
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <button type="button" className="participant-list__link-all">
                                            View all
                                            <FaChevronRight aria-hidden />
                                        </button>
                                        <nav aria-label="Пагинация списка участников">
                                            <ul className="participant-list__pagination">
                                                <li className="participant-list__page participant-list__page--disabled">
                                                    <span className="participant-list__page-link">
                                                        <FaChevronLeft aria-hidden />
                                                        <span className="visually-hidden">Previous</span>
                                                    </span>
                                                </li>
                                                <li className="participant-list__page participant-list__page--active">
                                                    <span className="participant-list__page-link">
                                                        1
                                                        <span className="visually-hidden"> (current)</span>
                                                    </span>
                                                </li>
                                                <li className="participant-list__page">
                                                    <a className="participant-list__page-link" href="#top">
                                                        2
                                                    </a>
                                                </li>
                                                <li className="participant-list__page">
                                                    <a className="participant-list__page-link" href="#top">
                                                        <FaChevronRight aria-hidden />
                                                        <span className="visually-hidden">Next</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </footer>
                            </>
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default ParticipantList;
