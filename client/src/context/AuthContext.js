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

    logout = () => {
        localStorage.removeItem('authToken');
        this.setState({ user: null });
    };

    render() {
        const { children } = this.props;
        const { user, loading } = this.state;

        return (
            <AuthContext.Provider value={{ user, loading, logout: this.logout, loadUser: this.loadUser }}>
                {children}
            </AuthContext.Provider>
        );
    }
}

export { AuthProvider, AuthContext };
