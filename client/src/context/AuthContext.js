/**
 * AuthContext — глобальное состояние авторизации.
 *
 * HTTP-клиент: config/http.js (Bearer из localStorage).
 *
 * Фаза 3 (сервер): login/profile отдают
 *   user.role, user.roleLabel, user.laboratory_id, user.employee_id
 * Клиент пока просто кладёт user в state — navPerms по роли (фаза 7).
 *
 * Проверить в Network:
 *   POST /api/users/login → token + user.role / laboratory_id
 *   GET  /api/users/profile → те же поля (+ employee.laboratory)
 */
import React, { createContext, Component } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';

const AuthContext = createContext();

class AuthProvider extends Component {
    state = {
        user: null,
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.loadUser();
    }

    loadUser = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await http.get(`${API.users}/profile`);

                this.setState({ user: response.data, loading: false, error: null });
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error.response?.data || error.message);
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                }
                this.setState({ user: null, loading: false, error: null });
            }
        } else {
            this.setState({ user: null, loading: false, error: null });
        }
    };
    login = async (email, password) => {
        try {
            const response = await http.post(`${API.users}/login`, { email, password });

            const token = response.data.token;
            localStorage.setItem('authToken', token);

            const userResponse = await http.get(`${API.users}/profile`);

            this.setState({ user: userResponse.data, loading: false, error: null });

            return { success: true };
        } catch (error) {
            console.error('Ошибка входа:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Ошибка входа' };
        }
    };

    updateProfile = async (data) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return { success: false, message: 'Необходима авторизация' };
        }

        try {
            const response = await http.put(`${API.users}/profile`, data);
            this.setState({ user: response.data, error: null });
            return { success: true, user: response.data };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Не удалось обновить профиль';
            return { success: false, message };
        }
    };

    logout = async () => {
        const token = localStorage.getItem('authToken');

        try {
            if (token) {
                await http.post(`${API.users}/logout`, {});
            }
        } catch (error) {
            console.error('Ошибка при попытке выхода:', error.response?.data || error.message);
        }

        localStorage.removeItem('authToken');
        this.setState({ user: null });
    };

    render() {
        const { children } = this.props;
        const { user, loading } = this.state;

        return (
            <AuthContext.Provider
                value={{
                    user,
                    loading,
                    isAuthenticated: Boolean(user),
                    login: this.login,
                    logout: this.logout,
                    loadUser: this.loadUser,
                    updateProfile: this.updateProfile,
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    }
}

export { AuthProvider, AuthContext };
