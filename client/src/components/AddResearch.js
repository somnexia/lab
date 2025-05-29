
import React, { Component } from 'react';
import axios from 'axios';
import { FaAngleDown } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
class AddResearch extends Component {
    state = {
        types: [],
        scopes: [],
        objects: [],
        fundings: [],
        employees: [],
        selectedLeader: '',
        selectedParticipants: [],
        startDate: null,
        deadline: null,
        title: '',
        taskView: '',
        selectedType: '',
        selectedObject: '',
        selectedScope: '',
        goal: '',
        client: '',
        selectedFunding: '',
    };
    componentDidMount() {
        this.fetchResearchData();
        this.fetchEmployees();
    }
    fetchResearchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/researches');
            const researches = response.data;
            // Извлекаем уникальные значения
            const types = [...new Set(researches.map(r => r.type))];
            const scopes = [...new Set(researches.map(r => r.scope))];
            const objects = [...new Set(researches.map(r => r.research_object))];
            const fundings = [...new Set(researches.map(r => r.funding_source))];
            this.setState({ types, scopes, objects, fundings });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };
    fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/employees');
            this.setState({ employees: response.data });
        } catch (error) {
            console.error('Ошибка загрузки сотрудников:', error);
        }
    };
    handleLeaderChange = (event) => {
        this.setState({ selectedLeader: event.target.value });
    };
    handleParticipantChange = (event) => {
        const value = Number(event.target.value); // Number() преобраpазование в число
        //либо сразу передавать employee.id как число, заменить атребут defaultValue вместо value
        this.setState((prevState) => ({
            selectedParticipants: prevState.selectedParticipants.includes(value)
                ? prevState.selectedParticipants.filter(id => id !== value)
                : [...prevState.selectedParticipants, value]
        }));
    };
    handleStartDateChange = (date) => {
        this.setState({ startDate: date });
    };
    handleDeadlineChange = (date) => {
        this.setState({ deadline: date });
    };
    handleSubmit = async (event) => {
        event.preventDefault();  // предотвращаем перезагрузку страницы при отправке формы
        const {
            title, taskView, selectedType, selectedObject, selectedScope,
            selectedLeader, selectedParticipants, startDate, deadline,
            goal, client, selectedFunding
        } = this.state;
        const errors = {};
        if (!title) errors.title = "Project title is required";
        if (!taskView) errors.taskView = "Task view is required";
        if (!selectedType) errors.selectedType = "Research type is required";
        if (!selectedObject) errors.selectedObject = "Research object is required";
        if (!selectedScope) errors.selectedScope = "Research scope is required";
        if (!selectedLeader) errors.selectedLeader = "Research leader is required";
        if (selectedParticipants.length === 0) errors.selectedParticipants = "At least one participant is required";
        if (!startDate) errors.startDate = "Start date is required";
        if (!deadline) errors.deadline = "Deadline is required";
        if (!goal) errors.goal = "Goal is required";
        if (!client) errors.client = "Client is required";
        if (!selectedFunding) errors.selectedFunding = "Funding source is required";
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }
        // Получаем значения из формы
        const formData = {
            title: this.state.title || null,
            taskView: this.state.taskView || null,
            type: this.state.selectedType || null,
            research_object: this.state.selectedObject || null,
            scope: this.state.selectedScope || null,
            leader: selectedLeader || null,
            participants: selectedParticipants || null,
            start_date: startDate ? startDate.toISOString().split('T')[0] : null,
            end_date: deadline ? deadline.toISOString().split('T')[0] : null,
            goal: this.state.goal || null,
            client: this.state.client || null,
            funding_source: this.state.selectedFunding || null
        };
        console.log("formData:", formData)
        try {
            // Отправка POST-запроса для создания нового исследования
            const response = await axios.post('http://localhost:3000/api/researches', formData);
            // Обработка успешного ответа
            console.log('Research created:', response.data);
            alert('Research created successfully!');
        } catch (error) {
            // Обработка ошибки
            console.error('Error creating research:', error);
            alert('Failed to create research.');
        }
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        return (
            <div>
                <h2>Create a research</h2>
                <div className='row'>
                    <div className='col-xl-9 col-12'>
                        <div className='g-3 mb-6 row'>
                            <div className="col-md-8 col-sm-6">
                                <div className="form-floating">
                                    <input
                                        name='title'
                                        value={this.state.title}
                                        onChange={(e) => this.setState({ title: e.target.value })}
                                        placeholder="Project title"
                                        type="text"
                                        id="floatingInputTitle"
                                        className={`form-control ${this.state.errors?.title ? 'is-invalid' : ''}`}
                                        required>
                                    </input>
                                    <label htmlFor="floatingInputTitle">Project title</label>
                                </div>
                                {this.state.errors?.title && <div className="text-danger">{this.state.errors.title}</div>}
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="form-floating">
                                    <select
                                        name='taskView'
                                        className={`form-select ${this.state.errors?.taskView ? 'is-invalid' : ''}`}
                                        id="floatingSelectTask"
                                        value={this.state.taskView}
                                        onChange={this.handleChange}>
                                        <option value="">Select task view</option>
                                        <option defaultValue="1">technical</option>
                                        <option defaultValue="2">external</option>
                                        <option defaultValue="3">organizational</option>
                                    </select>
                                    <label htmlFor="floatingSelectTask">Defult task view</label>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="form-floating">
                                    <select
                                        name="selectedType"
                                        value={this.state.selectedType}
                                        onChange={this.handleChange}
                                        className={`form-select ${this.state.errors?.selectedType ? 'is-invalid' : ''}`}
                                        id="floatingSelectType"
                                    >
                                        <option value="">Select research type</option>
                                        {this.state.types.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                        {/* здесь должены быть данные из базы данных колонки type  */}
                                    </select>
                                    <label htmlFor="floatingSelectType">Research type</label>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="input-group mb-3">
                                    <div className="form-floating">
                                        <input
                                            name="selectedObject"
                                            value={this.state.selectedObject}
                                            onChange={this.handleChange}
                                            type="text"
                                            list="objectOptions"
                                            id="floatingObject"
                                            className={`form-control ${this.state.errors?.selectedObject ? 'is-invalid' : ''}`}
                                            placeholder="Research object"
                                        />
                                        <label htmlFor="floatingObject">Research object</label>
                                    </div>
                                    <datalist id="objectOptions">
                                        {this.state.objects.map((obj, index) => (
                                            <option key={index} value={obj} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="input-group mb-3">
                                    <div className="form-floating">
                                        <input
                                            name="selectedScope"
                                            value={this.state.selectedScope}
                                            onChange={this.handleChange}
                                            type="text"
                                            id="floatingScope"
                                            list="scopeOptions"
                                            className={`form-control ${this.state.errors?.selectedScope ? 'is-invalid' : ''}`}
                                            placeholder="Research scope"
                                        />
                                        <label htmlFor="floatingScope">Research scope</label>
                                    </div>
                                    <datalist id="scopeOptions">
                                        {this.state.scopes.map((scope, index) => (
                                            <option key={index} value={scope} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="form-floating">
                                    <select
                                        name='selectedLeader'
                                        className={`form-select ${this.state.errors?.selectedLeader ? 'is-invalid' : ''}`}
                                        id="floatingSelectLeader"
                                        value={this.state.selectedLeader}
                                        onChange={this.handleLeaderChange}>
                                        <option value="">Select Research Leader</option>
                                        {this.state.employees.map(employee => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name} ({employee.position})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingSelectLeader">Research leader</label>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="form-floating">
                                    <DatePicker
                                        name='startDate'
                                        type="text"
                                        selected={this.state.startDate}
                                        onChange={this.handleStartDateChange}
                                        className={`form-control ${this.state.errors?.startDate ? 'is-invalid' : ''}`}
                                        dateFormat="yyyy-MM-dd"
                                        placeholder="Start date"
                                        id='startDate'
                                        onFocus={() => this.setState({ isFocused: true })}
                                        onBlur={() => this.setState({ isFocused: !!this.state.startDate })}>
                                    </DatePicker>
                                    <label htmlFor="startDate" className={this.state.isFocused ? 'active' : ''}>Start date</label>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <div className="form-floating">
                                    <DatePicker
                                        name="deadline"
                                        type="text"
                                        selected={this.state.deadline}
                                        onChange={this.handleDeadlineChange}
                                        className={`form-control ${this.state.errors?.deadline ? 'is-invalid' : ''}`}
                                        dateFormat="yyyy-MM-dd"
                                        placeholder="Deadline"
                                        id='deadline'
                                        onFocus={() => this.setState({ isFocused: true })}
                                        onBlur={() => this.setState({ isFocused: !!this.state.deadline })}>
                                    </DatePicker>
                                    <label htmlFor="deadline" className={this.state.isFocused ? 'active' : ''}>Deadline</label>
                                </div>
                            </div>
                            <div className="gy-6 col-12">
                                <FaAngleDown />
                                <label className="text-capitalize fw-bolder">Research Participants</label>
                                <div className="form-check"
                                    id='checkboxParticipant'>
                                    {this.state.employees.map(employee => (
                                        <div key={employee.id}>
                                            <input
                                                name='selectedParticipants'
                                                type="checkbox"
                                                className={`form-check-input ${this.state.errors?.selectedParticipants ? 'is-invalid' : ''}`}
                                                id={`participant-${employee.id}`}
                                                value={employee.id}
                                                checked={this.state.selectedParticipants.includes(employee.id)}
                                                onChange={this.handleParticipantChange}
                                            />
                                            <label className="form-check-label" htmlFor={`participant-${employee.id}`}>
                                                {employee.name} {employee.surname} ({employee.position})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="gy-6 col-12">
                                <div className="form-floating">
                                    <textarea
                                        name='goal'
                                        defaultValue={this.state.goal}
                                        onChange={this.handleChange}
                                        placeholder="Leave a comment here"
                                        id="floatingProjectOverview"
                                        className={`form-control ${this.state.errors?.goal ? 'is-invalid' : ''}`}
                                        style={{ height: "100px" }}>
                                    </textarea>
                                    <label htmlFor="floatingProjectOverview">Project overview</label>
                                </div>
                            </div>
                            <div className="gy-6 col-md-6">
                                <div className="input-group mb-3">
                                    <div className="form-floating">
                                        <input
                                            name='client'
                                            defaultValue={this.state.client}
                                            onChange={this.handleChange}
                                            type="text"
                                            placeholder='Client'
                                            list="ClientOptions"
                                            className={`form-control ${this.state.errors?.client ? 'is-invalid' : ''}`}
                                            id='floatingInputClient'>
                                        </input>
                                        <label htmlFor="floatingInputClient">Client</label>
                                    </div>
                                    <datalist id="ClientOptions">
                                        {/* здесь должены быть данные из базы данных колонки client */}
                                    </datalist>
                                </div>
                            </div>
                            <div className="gy-6 col-md-6">
                                <div className="input-group mb-3">
                                    <div className="form-floating">
                                        <input
                                            name="selectedFunding"
                                            value={this.state.selectedFunding}
                                            onChange={this.handleChange}
                                            type="text"
                                            id='floatingFunding'
                                            placeholder='Funding source'
                                            list="fundingOptions"
                                            className={`form-control ${this.state.errors?.selectedFunding ? 'is-invalid' : ''}`}>
                                        </input>
                                        <label htmlFor="floatingFunding">Funding source</label>
                                    </div>
                                    <datalist id="fundingOptions">
                                        {this.state.fundings.map((funding, index) => (
                                            <option key={index} value={funding}></option>
                                        ))}
                                        {/* здесь должены быть данные из базы данных колонки funding_source */}
                                    </datalist>
                                </div>
                            </div>
                            <div className="gy-6 col-12">
                                <div className="d-flex justify-content-end gap-3">
                                    <button type="button" className="px-5 btn btn-phoenix-primary">Cancel</button>
                                    <button onClick={this.handleSubmit} type="button" className="px-5 px-sm-15 btn btn-primary">Create Project</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
export default AddResearch;