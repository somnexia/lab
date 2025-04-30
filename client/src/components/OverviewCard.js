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
        const { Icon, color, title } = this.props;
        const { count } = this.state;

        return (
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className={`d-flex align-items-center justify-content-center rounded-circle ${color}`} style={{ width: '48px', height: '48px' }}>
                            <Icon style={{ width: '24px', height: '24px' }} />
                        </div>
                        <div className="ms-3 flex-grow-1">
                            <dl>
                                <dt className="text-muted small mb-1">{title}</dt>
                                <dd className="h5 mb-0">{count !== null ? count : 'Загрузка...'}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-light py-2 px-3">
                    <a href="#" className="text-decoration-none text-primary">
                        View all
                    </a>
                </div>
            </div>
        );
    }
}

export default OverviewCard;
