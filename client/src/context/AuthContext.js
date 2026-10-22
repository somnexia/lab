/**
 * AuthContext — глобальное состояние авторизации.
 *
 * HTTP-клиент: config/http.js (Bearer из localStorage).
 *
 * login/profile отдают: role, roleLabel, laboratory_id, employee_id
 * perms = buildNavPerms(user) — флаги для Aside / Header / RequirePerm.
 * UI скрывает пункты и URL; API по-прежнему режет через authorize.
 */
import React, { createContext, Component } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';
import { buildNavPerms, emptyNavPerms } from '../config/navPerms';

const AuthContext = createContext();

class AuthProvider extends Component {
    state = {
        user: null,
        perms: emptyNavPerms(),
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.loadUser();
    }

    applyUser = (user) => {
        this.setState({
            user: user || null,
            perms: buildNavPerms(user || null),
            loading: false,
            error: null,
        });
    };

    loadUser = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await http.get(`${API.users}/profile`);
                this.applyUser(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error.response?.data || error.message);
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                }
                this.applyUser(null);
            }
        } else {
            this.applyUser(null);
        }
    };

    login = async (email, password) => {
        try {
            const response = await http.post(`${API.users}/login`, { email, password });

            const token = response.data.token;
            localStorage.setItem('authToken', token);

            const userResponse = await http.get(`${API.users}/profile`);
            this.applyUser(userResponse.data);

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
            this.applyUser(response.data);
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
        this.applyUser(null);
    };

    /**
     * Проверка одного флага из perms.
     * Пример: can('showUserLog') / can('canManageInventory')
     */
    can = (permKey) => {
        const { perms } = this.state;
        return Boolean(perms && perms[permKey]);
    };

    render() {
        const { children } = this.props;
        const { user, perms, loading } = this.state;

        return (
            <AuthContext.Provider
                value={{
                    user,
                    perms,
                    loading,
                    isAuthenticated: Boolean(user),
                    can: this.can,
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
