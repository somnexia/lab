import React, { Component } from "react";
import { AuthContext } from "../context/AuthContext";

class ProfileEdit extends Component {
    static contextType = AuthContext;

    state = {
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        fieldErrors: {},
        formError: null,
        saving: false,
    };

    componentDidMount() {
        this.syncFromUser(this.props.user);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user?.id !== this.props.user?.id || prevProps.user?.updatedAt !== this.props.user?.updatedAt) {
            if (!this.state.saving) {
                this.syncFromUser(this.props.user);
            }
        }
    }

    syncFromUser(user) {
        if (!user) return;
        this.setState({
            name: user.name || "",
            email: user.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            fieldErrors: {},
            formError: null,
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState((prev) => ({
            [name]: value,
            fieldErrors: { ...prev.fieldErrors, [name]: null },
            formError: null,
        }));
    };

    validate() {
        const { name, email, newPassword, confirmPassword, currentPassword } = this.state;
        const fieldErrors = {};

        if (!name.trim()) {
            fieldErrors.name = "Enter your name";
        }
        if (!email.trim()) {
            fieldErrors.email = "Enter your email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            fieldErrors.email = "Invalid email format";
        }

        const wantsPasswordChange = Boolean(newPassword || confirmPassword || currentPassword);
        if (wantsPasswordChange) {
            if (!currentPassword) {
                fieldErrors.currentPassword = "Current password is required";
            }
            if (!newPassword) {
                fieldErrors.newPassword = "Enter a new password";
            } else if (newPassword.length < 6) {
                fieldErrors.newPassword = "Password must be at least 6 characters";
            }
            if (newPassword !== confirmPassword) {
                fieldErrors.confirmPassword = "Passwords do not match";
            }
        }

        this.setState({ fieldErrors });
        return Object.keys(fieldErrors).length === 0;
    }

    buildPayload() {
        const { name, email, currentPassword, newPassword } = this.state;
        const payload = {
            name: name.trim(),
            email: email.trim(),
        };

        if (newPassword) {
            payload.password = newPassword;
            payload.currentPassword = currentPassword;
        }

        return payload;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (!this.validate()) return;

        const { updateProfile } = this.context;
        const { onSaved } = this.props;

        this.setState({ saving: true, formError: null });

        const result = await updateProfile(this.buildPayload());

        if (result.success) {
            this.setState({
                saving: false,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            if (onSaved) onSaved("Profile updated successfully.");
            return;
        }

        this.setState({
            saving: false,
            formError: result.message || "Could not save profile",
        });
    };

    handleReset = () => {
        this.syncFromUser(this.props.user);
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const {
            name,
            email,
            currentPassword,
            newPassword,
            confirmPassword,
            fieldErrors,
            formError,
            saving,
        } = this.state;

        const inputClass = (field) =>
            `lab-profile-edit__input${fieldErrors[field] ? " lab-profile-edit__input--error" : ""}`;

        return (
            <form className="lab-profile-edit__form" onSubmit={this.handleSubmit} noValidate>
                {formError ? (
                    <p className="lab-profile-edit__error" role="alert">
                        {formError}
                    </p>
                ) : null}

                <p className="lab-profile-edit__section-title">Account</p>

                <div className="lab-profile-edit__field">
                    <label className="lab-profile-edit__label" htmlFor="profile-name">
                        Full name
                    </label>
                    <input
                        id="profile-name"
                        name="name"
                        type="text"
                        className={inputClass("name")}
                        value={name}
                        onChange={this.handleChange}
                        autoComplete="name"
                        disabled={saving}
                    />
                    {fieldErrors.name ? <p className="lab-profile-edit__error">{fieldErrors.name}</p> : null}
                </div>

                <div className="lab-profile-edit__field">
                    <label className="lab-profile-edit__label" htmlFor="profile-email">
                        Email
                    </label>
                    <input
                        id="profile-email"
                        name="email"
                        type="email"
                        className={inputClass("email")}
                        value={email}
                        onChange={this.handleChange}
                        autoComplete="email"
                        disabled={saving}
                    />
                    {fieldErrors.email ? <p className="lab-profile-edit__error">{fieldErrors.email}</p> : null}
                </div>

                <p className="lab-profile-edit__section-title">Change password</p>
                <p className="lab-profile-edit__hint">
                    Leave password fields empty if you only want to update name or email.
                </p>

                <div className="lab-profile-edit__field">
                    <label className="lab-profile-edit__label" htmlFor="profile-current-password">
                        Current password
                    </label>
                    <input
                        id="profile-current-password"
                        name="currentPassword"
                        type="password"
                        className={inputClass("currentPassword")}
                        value={currentPassword}
                        onChange={this.handleChange}
                        autoComplete="current-password"
                        disabled={saving}
                    />
                    {fieldErrors.currentPassword ? (
                        <p className="lab-profile-edit__error">{fieldErrors.currentPassword}</p>
                    ) : null}
                </div>

                <div className="lab-profile-edit__field">
                    <label className="lab-profile-edit__label" htmlFor="profile-new-password">
                        New password
                    </label>
                    <input
                        id="profile-new-password"
                        name="newPassword"
                        type="password"
                        className={inputClass("newPassword")}
                        value={newPassword}
                        onChange={this.handleChange}
                        autoComplete="new-password"
                        disabled={saving}
                    />
                    {fieldErrors.newPassword ? (
                        <p className="lab-profile-edit__error">{fieldErrors.newPassword}</p>
                    ) : null}
                </div>

                <div className="lab-profile-edit__field">
                    <label className="lab-profile-edit__label" htmlFor="profile-confirm-password">
                        Confirm new password
                    </label>
                    <input
                        id="profile-confirm-password"
                        name="confirmPassword"
                        type="password"
                        className={inputClass("confirmPassword")}
                        value={confirmPassword}
                        onChange={this.handleChange}
                        autoComplete="new-password"
                        disabled={saving}
                    />
                    {fieldErrors.confirmPassword ? (
                        <p className="lab-profile-edit__error">{fieldErrors.confirmPassword}</p>
                    ) : null}
                </div>

                <div className="lab-profile-edit__actions lab-profile__actions">
                    <button type="submit" className="lab-profile__btn-primary" disabled={saving}>
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button
                        type="button"
                        className="lab-profile__btn-ghost"
                        onClick={this.handleReset}
                        disabled={saving}
                    >
                        Reset
                    </button>
                </div>
            </form>
        );
    }
}

export default ProfileEdit;
