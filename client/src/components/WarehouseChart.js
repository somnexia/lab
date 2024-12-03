import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const WarehouseChart = ({ warehouses }) => {
    if (!warehouses || warehouses.length === 0) {
        return <p>Нет данных для отображения графика</p>;
    }

    // Рассчет общей статистики
    const totalCapacity = warehouses.reduce((sum, w) => sum + Number(w.capacity || 0), 0);
    const totalUtilization = warehouses.reduce((sum, w) => sum + Number(w.current_utilization || 0), 0);
    const utilizationPercentage = totalCapacity > 0
        ? ((totalUtilization / totalCapacity) * 100).toFixed(1)
        : '0.0'; // Проверка деления на 0
    const utilizationChange = '+26.5%'; // Пример значения для изменений за 7 дней
    const additionalUtilization = '+350.00'; // Пример дополнительного увеличения

    // Данные для графика
    const data = {
        labels: warehouses.map((w) => w.storage_name),
        datasets: [
            {
                label: 'Текущая загрузка',
                data: warehouses.map((w) => w.current_utilization),
                backgroundColor: '#727cf5',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            
        },
    };

    return (
        <div>



            <div className='d-flex justify-content-between'>
                {/* Статистика над графиком */}

                <div>
                    <h3 className='d-flex '>
                        Utilization <span className="ps-3" style={{ color: '#4caf50' }}>{utilizationChange}</span>
                    </h3>
                    <p style={{ color: '#888' }}>Last 7 days</p>
                </div>

                <p style={{ color: '#555' }}>
                    Общая заполняемость:<br />{totalUtilization} / {totalCapacity} ({utilizationPercentage}%)
                </p>
            </div>
            <div className='pb-0 pt-4'>

                {/* График */}
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default WarehouseChart;
