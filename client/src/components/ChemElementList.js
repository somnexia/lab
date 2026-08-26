// /client/src/components/ChemElementList.js
import React, { useState, useEffect } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * ChemElementList — справочник элементов (пункт 7 / catalog).
 * Было: axios.get('http://localhost:3000/api/chemelements')
 * Стало: http.get(API.chemElements)  → /api/chemElements
 */
const ChemElementList = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const fetchElements = async () => {
            try {
                const response = await http.get(API.chemElements);
                setElements(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchElements();
    }, []);

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
