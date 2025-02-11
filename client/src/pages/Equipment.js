import React, { Component } from "react";
import EquipmentCategory from "../components/EquipmentCategory";
import EquipmentTable from "../components/EquipmentTable";
import EquipmentGroup from "../components/EquipmentGroup"; // Импортируем новый компонент
import { CartContext } from "../context/CartContext"; // Импорт контекста

class Equipment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: "", // Состояние для выбранной категории
            selectedGroup: "", // Состояние для выбранной группы
            groups: [], // Группы для выбранной категории

        };
    }

    // Обработчик изменения категории
    handleCategoryChange = (category, groups) => {
        this.setState({
            selectedCategory: category,
            groups: groups,
            selectedGroup: "", // Сброс выбранной группы при смене категории
        });
    };

    // Обработчик изменения группы
    handleGroupChange = (value) => {
        console.log("Selected group:", value); // Логируем выбранную группу
        this.setState({ selectedGroup: value });
    };



    render() {
        const { selectedCategory, selectedGroup, groups } = this.state;

        return (
            <div>
                <h2>Equipment</h2>
                <hr></hr>

                <div className="row justify-content-between py-4">
                    <div className="col-12 col-sm-4 col-xl-3 mb-5 mb-sm-0">
                        <div className="card lab-nav-card card-reset">
                            <div className="card-body p-0">
                                <div className="row g-3">
                                    <EquipmentCategory onCategoryChange={this.handleCategoryChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-8 col-xxl-9 mb-5">
                        <div className="row g-3">
                            <div className="card bg-body-emphasis text-bg-dark border-0 h-100">
                                {/* Передаем категории и группы в компонент фильтрации по группе */}
                                <EquipmentGroup
                                    groups={groups} // Массив групп
                                    onGroupChange={this.handleGroupChange}
                                />
                                {/* Передаем выбранную категорию и группу в EquipmentTable */}
                                {/* Используем контекст для добавления в корзину */}
                                <CartContext.Consumer>
                                    {({ addToCart }) => (
                                        <EquipmentTable
                                            category={selectedCategory}
                                            group={selectedGroup}
                                            onAddToCart={addToCart}
                                        />
                                    )}
                                </CartContext.Consumer>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

export default Equipment;
