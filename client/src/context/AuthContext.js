// src/context/AuthContext.js
import React, { createContext, Component } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';

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
                const response = await axios.get(`${API_BASE}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

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
            const response = await axios.post(`${API_BASE}/users/login`, { email, password });

            const token = response.data.token;
            localStorage.setItem('authToken', token);

            const userResponse = await axios.get(`${API_BASE}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

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
            const response = await axios.put(
                `${API_BASE}/users/profile`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
                await axios.post(
                    `${API_BASE}/users/logout`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
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
