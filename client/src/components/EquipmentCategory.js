import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class EquipmentCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [
                "general",
                "specialized",
                "measuring",
                "analytical",
                "testing",
            ],
        };
    }

    loadGroupsByCategory = async (category) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/ChemEquipments/groups?category=${category}`
            );
            // Передаем категорию и группы в родительский компонент
            this.props.onCategoryChange(category, response.data);
        } catch (error) {
            console.error("Ошибка при загрузке групп:", error);
        }
    };

    render() {
        const { categories } = this.state;

        return (
            <>
                {categories.map((category) => (
                    <div key={category} className="col-sm-6 col-4 col-xxl-5">
                        <div className="card text-bg-dark">
                            <div className="card-body p-0">
                                <a
                                    className="btn btn-lab square-button text-start w-100"
                                    onClick={() => this.loadGroupsByCategory(category)}
                                    
                                >
                                    <div className="fw-bold pt-2">
                                        {category}
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    }
}

export default EquipmentCategory;
