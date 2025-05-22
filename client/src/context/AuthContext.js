// src/context/AuthContext.js
import React, { createContext, Component } from 'react';
import axios from 'axios';

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
                const response = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                this.setState({ user: response.data, loading: false });
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error.response?.data || error.message);
                this.setState({ user: null, loading: false });
            }
        } else {
            this.setState({ user: null, loading: false });
        }
    };
    login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', { email, password });

            const token = response.data.token;
            localStorage.setItem('authToken', token);

            // Загружаем данные пользователя сразу после входа
            const userResponse = await axios.get('http://localhost:3000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            this.setState({ user: userResponse.data, loading: false });

            await this.loadUser();

            return { success: true };
        } catch (error) {
            console.error('Ошибка входа:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Ошибка входа' };
        }
    };

    logout = async () => {
        const token = localStorage.getItem('authToken');

        try {
            if (token) {
                await axios.post(
                    'http://localhost:3000/api/users/logout',
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
            <AuthContext.Provider value={{ user, loading, login: this.login, logout: this.logout, loadUser: this.loadUser }}>
                {children}
            </AuthContext.Provider>
        );
    }
}

export { AuthProvider, AuthContext };
