import React, { Component } from 'react';
import axios from 'axios';

class OverviewCard extends Component {
    state = {
        count: null,
    };

    async componentDidMount() {
        const { itemType } = this.props;
        let endpoint = '';

        // Определяем, какой endpoint использовать
        // Компонент получает пропс itemType (например, 'research').
        // По значению itemType выбирается, какой URL использовать для запроса.
        // Если itemType не передан — значение будет undefined, и в switch ни один case не совпадёт.
        switch (itemType) {
            case 'chemicals':
                endpoint = 'http://localhost:3000/api/inventories/chemicals/count';
                break;
            case 'equipment':
                endpoint = 'http://localhost:3000/api/inventories/equipment/count';
                break;
            case 'researches':
                endpoint = 'http://localhost:3000/api/researches/ongoing/count';
                break;
            case 'orders':
                endpoint = 'http://localhost:3000/api/orders/active/count';
                break;

            default:
                console.warn('Неизвестный тип инвентаря:', itemType);
                return;
        }

        try {
            const response = await axios.get(endpoint);
            this.setState({ count: response.data.count });
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    render() {
        const { Icon, variant = 'accent', title } = this.props;
        const { count } = this.state;

        return (
            <div className="overview-card">
                <div className="overview-card__body">
                    <div className="d-flex align-items-center">
                        <div className={`overview-card__icon overview-card__icon--${variant}`}>
                            <Icon size={24} />
                        </div>
                        <div className="ms-3 flex-grow-1">
                            <dl className="mb-0">
                                <dt className="overview-card__label">{title}</dt>
                                <dd className="overview-card__value">{count !== null ? count : 'Загрузка...'}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="overview-card__footer">
                    <a href="#" className="overview-card__link">
                        View all
                    </a>
                </div>
            </div>
        );
    }
}

export default OverviewCard;
