

import React, { Component } from "react";
import axios from 'axios';

class ProfileEdit extends Component {
    state = {
        ...this.state,
        isEditing: false,
        updatedName: '',
        updatedEmail: '',
    };
    toggleEdit = () => {
        const { user } = this.state;
        this.setState({
            isEditing: !this.state.isEditing,
            updatedName: user.name,
            updatedEmail: user.email,
        });
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    saveChanges = () => {
        const { updatedName, updatedEmail } = this.state;
        this.handleUpdateUser({ name: updatedName, email: updatedEmail });
        this.toggleEdit();
    };
    render() {
        const { updatedName, updatedEmail } = this.state;
        return (
            <div>
                <input
                    type="text"
                    name="updatedName"
                    value={updatedName}
                    onChange={this.handleInputChange}
                    placeholder="Имя"
                />
                <input
                    type="email"
                    name="updatedEmail"
                    value={updatedEmail}
                    onChange={this.handleInputChange}
                    placeholder="Email"
                />
                <button onClick={this.saveChanges}>Сохранить</button>
                <button onClick={this.toggleEdit}>Отмена</button>
            </div>
        )
    }
}

export default ProfileEdit;