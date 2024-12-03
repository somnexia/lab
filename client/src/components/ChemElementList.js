// /client/src/components/ChemElementList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChemElementList = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        // Функция для загрузки данных
        const fetchElements = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/chemelements');
                setElements(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchElements();
    }, []); // пустой массив зависимостей чтобы запрос выполнился один раз

    return (
        <div>
            <h2>Список химических элементов</h2>
            <ul>
                {elements.map((element) => (
                    <li key={element.id}>
                        {element.name} ({element.symbol})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChemElementList;
