import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Form, Col } from 'react-bootstrap';

class AdminLogsPage extends Component {
  state = {
    logs: [],
    loading: true,
    page: 1,
    totalLogs: 0,
    logsPerPage: 10,
    searchQuery: '',
    filterStatus: '',
  };

  async componentDidMount() {
    this.loadLogs();
  }

  loadLogs = async () => {
    const { page, logsPerPage, searchQuery, filterStatus } = this.state;
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

      this.setState({
        logs: response.data.logs,
        loading: false,
        totalLogs: response.data.totalLogs,
      });
    } catch (error) {
      console.error('Ошибка при загрузке логов:', error);
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleFilterChange = (event) => {
    this.setState({ filterStatus: event.target.value });
  };

  handleSearchSubmit = (event) => {
    event.preventDefault();
    this.setState({ page: 1, loading: true }, this.loadLogs);
  };

  handlePageChange = (newPage) => {
    this.setState({ page: newPage, loading: true }, this.loadLogs);
  };

  render() {
    const { logs, loading, page, totalLogs, logsPerPage, searchQuery, filterStatus } = this.state;

    const totalPages = Math.ceil(totalLogs / logsPerPage);

    if (loading) {
      return (
        <div className="container mt-4 text-center">
          <Spinner animation="border" variant="primary" />
          <p>Загрузка...</p>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        <h2>Журнал активности пользователей</h2>

        <Form onSubmit={this.handleSearchSubmit} className="mb-3">
          <Form.Row>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Поиск по действию или ресурсу"
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
            </Col>
            <Col md={3}>
              <Form.Control as="select" value={filterStatus} onChange={this.handleFilterChange}>
                <option value="">Все статусы</option>
                <option value="success">Успешно</option>
                <option value="error">Ошибка</option>
                <option value="pending">В ожидании</option>
              </Form.Control>
            </Col>
            <Col md={2}>
              <Button type="submit" variant="primary" block>
                Поиск
              </Button>
            </Col>
          </Form.Row>
        </Form>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Дата и время</th>
              <th>Пользователь</th>
              <th>Действие</th>
              <th>Ресурс</th>
              <th>Тип ресурса</th>
              <th>Описание</th>
              <th>IP-адрес</th>
              <th>User Agent</th>
              <th>Session ID</th>
              <th>Статус</th>
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
            onClick={() => this.handlePageChange(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span>Страница {page} из {totalPages}</span>
          <Button
            variant="secondary"
            onClick={() => this.handlePageChange(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            Вперед
          </Button>
        </div>
      </div>
    );
  }
}

export default AdminLogsPage;
