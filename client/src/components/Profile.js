import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import ProfileEdit from "./ProfileEdit";

function initialsFromName(name) {
    if (!name || typeof name !== "string") return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
}

function employeeDisplayName(employee) {
    if (!employee) return null;
    const parts = [employee.name, employee.surname].filter(Boolean);
    return parts.join(" ").trim() || null;
}

const TABS = [
    { id: "overview", label: "Overview" },
    { id: "personal", label: "Edit profile" },
];

class Profile extends Component {
    static contextType = AuthContext;

    state = {
        activeTab: "overview",
        feedback: null,
    };

    componentWillUnmount() {
        window.clearTimeout(this._feedbackTimer);
    }

    setActiveTab = (tabId) => {
        this.setState({ activeTab: tabId });
    };

    showFeedback = (message, isError = false) => {
        this.setState({ feedback: { message, isError } });
        window.clearTimeout(this._feedbackTimer);
        this._feedbackTimer = window.setTimeout(() => {
            this.setState({ feedback: null });
        }, 5000);
    };

    handleProfileSaved = (message) => {
        this.showFeedback(message, false);
        this.setState({ activeTab: "overview" });
    };

    renderOverview(user) {
        return (
            <div className="lab-profile__panel">
                <div className="lab-profile__card">
                    <h3 className="lab-profile__card-title">Account details</h3>
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Full name</p>
                        <p className="lab-profile__detail-value">{user.name || "—"}</p>
                    </div>
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Email</p>
                        <p className="lab-profile__detail-value">
                            {user.email ? (
                                <a href={`mailto:${user.email}`}>{user.email}</a>
                            ) : (
                                "—"
                            )}
                        </p>
                    </div>
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Member since</p>
                        <p className="lab-profile__detail-value">{formatDate(user.createdAt)}</p>
                    </div>
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Last updated</p>
                        <p className="lab-profile__detail-value">{formatDate(user.updatedAt)}</p>
                    </div>
                    <div className="lab-profile__actions">
                        <button
                            type="button"
                            className="lab-profile__btn-primary"
                            onClick={() => this.setActiveTab("personal")}
                        >
                            <FaPen aria-hidden />
                            Edit profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderEmployeeCard(employee) {
        if (!employee) {
            return (
                <div className="lab-profile__card">
                    <h3 className="lab-profile__card-title">Lab member</h3>
                    <p className="lab-profile__meta">
                        No employee record is linked to this account yet.
                    </p>
                </div>
            );
        }

        const name = employeeDisplayName(employee);
        const labName = employee.laboratory?.lab_name;

        return (
            <div className="lab-profile__card">
                <h3 className="lab-profile__card-title">Lab member</h3>
                <div className="lab-profile__detail-row">
                    <p className="lab-profile__detail-label">Name</p>
                    <p className="lab-profile__detail-value">{name || "—"}</p>
                </div>
                {employee.position ? (
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Position</p>
                        <p className="lab-profile__detail-value">{employee.position}</p>
                    </div>
                ) : null}
                {employee.department ? (
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Department</p>
                        <p className="lab-profile__detail-value">{employee.department}</p>
                    </div>
                ) : null}
                {employee.specialization ? (
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Specialization</p>
                        <p className="lab-profile__detail-value">{employee.specialization}</p>
                    </div>
                ) : null}
                {labName ? (
                    <div className="lab-profile__detail-row">
                        <p className="lab-profile__detail-label">Laboratory</p>
                        <p className="lab-profile__detail-value">{labName}</p>
                    </div>
                ) : null}
            </div>
        );
    }

    render() {
        const { user, loading } = this.context;
        const { activeTab, feedback } = this.state;

        if (loading) {
            return (
                <section className="lab-profile" aria-busy="true">
                    <p className="lab-profile__loading">Loading profile…</p>
                </section>
            );
        }

        if (!user) {
            return (
                <section className="lab-profile">
                    <header className="lab-profile__header">
                        <p className="lab-profile__eyebrow">Account</p>
                        <h2 className="lab-profile__title">Profile</h2>
                    </header>
                    <p className="lab-profile__signin">
                        You are not signed in.{" "}
                        <Link to="/management/signin">Sign in</Link> to view and edit your profile.
                    </p>
                </section>
            );
        }

        const employee = user.employee;

        return (
            <section className="lab-profile" aria-labelledby="lab-profile-title">
                <header className="lab-profile__header">
                    <p className="lab-profile__eyebrow">Account</p>
                    <h2 id="lab-profile-title" className="lab-profile__title">
                        Profile
                    </h2>
                    <p className="lab-profile__subtitle">
                        View your account information and update your name, email, or password.
                    </p>
                </header>

                {feedback ? (
                    <p
                        className={`lab-profile__feedback lab-profile__feedback--${
                            feedback.isError ? "error" : "success"
                        }`}
                        role="status"
                    >
                        {feedback.message}
                    </p>
                ) : null}

                <div className="lab-profile__layout">
                    <div className="lab-profile__card">
                        <div className="lab-profile__hero">
                            <span className="lab-profile__avatar" aria-hidden>
                                {initialsFromName(user.name)}
                            </span>
                            <div className="lab-profile__hero-main">
                                <h3 className="lab-profile__name">{user.name}</h3>
                                <p className="lab-profile__email">{user.email}</p>
                                <p className="lab-profile__meta">
                                    Member since {formatDate(user.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {this.renderEmployeeCard(employee)}
                </div>

                <div className="lab-profile__tabs" role="tablist" aria-label="Profile sections">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={
                                activeTab === tab.id
                                    ? "lab-profile__tab lab-profile__tab--active"
                                    : "lab-profile__tab"
                            }
                            onClick={() => this.setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "overview" ? this.renderOverview(user) : null}
                {activeTab === "personal" ? (
                    <div className="lab-profile__panel" role="tabpanel">
                        <div className="lab-profile__card">
                            <h3 className="lab-profile__card-title">Edit profile</h3>
                            <ProfileEdit user={user} onSaved={this.handleProfileSaved} />
                        </div>
                    </div>
                ) : null}
            </section>
        );
    }
}

export default Profile;
