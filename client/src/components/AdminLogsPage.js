import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Form, Col, Row } from 'react-bootstrap';



const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      const offset = (page - 1) * logsPerPage;
      try {
        const response = await axios.get('http://localhost:3000/api/logs', {
          params: {
            limit: logsPerPage,
            offset: offset,
            search: searchQuery,
            status: filterStatus,
          },
        });

        setLogs(Array.isArray(response.data.logs) ? response.data.logs : []);
        setTotalLogs(typeof response.data.totalLogs === 'number' ? response.data.totalLogs : 0);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке логов:', error);
        setLogs([]); // на всякий случай сброс
        setTotalLogs(0);
        setLoading(false);
      }
    };

    loadLogs();
  }, [page, searchQuery, filterStatus, logsPerPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1); // Сбрасываем страницу на 1 при новом поиске
    setLoading(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const totalPages = Math.ceil(totalLogs / logsPerPage);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>User activity log</h2>

      <Form onSubmit={handleSearchSubmit} className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by action or resource"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control as="select" value={filterStatus} onChange={handleFilterChange}>
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="pending">Pending</option>
            </Form.Control>
          </Col>
          <Col md={4}>
            <Button variant="secondary" type="submit">

              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Date and Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Resource Type</th>
            <th>Description</th>
            <th>IP Address</th>
            <th>User Agent</th>
            <th>Session ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.user?.name || 'Неизвестно'}</td>
              <td>{log.action}</td>
              <td>{log.resource_id}</td>
              <td>{log.resource_type}</td>
              <td>{log.description || '-'}</td>
              <td>{log.ip_address}</td>
              <td>{log.user_agent}</td>
              <td>{log.session_id}</td>
              <td>{log.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="secondary"
          onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          Back
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          variant="secondary"
          onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdminLogsPage;
