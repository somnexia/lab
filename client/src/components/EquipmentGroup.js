import React, { Component } from "react";

class EquipmentGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGroup: "", // Состояние для хранения выбранной группы
        };
    }

    handleGroupChange = (event) => {
        const { value } = event.target;
        this.setState({ selectedGroup: value });

        // Передаем выбранную группу в родительский компонент
        this.props.onGroupChange(value);
    };

    render() {
        const { groups } = this.props;

        return (
            <>
                <div className="card-header pt-3 border-0">
                    <h3 className="card-header-title">Equipment List</h3>
                </div>

                <div className="form-group pt-3 border-0 px-3">

                    <select
                        id="group"
                        className="form-control"
                        value={this.state.selectedGroup}
                        onChange={this.handleGroupChange}
                    >
                        <option value="">-- Select Group --</option>
                        {groups.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                </div>
            </>

        );
    }
}

export default EquipmentGroup;
