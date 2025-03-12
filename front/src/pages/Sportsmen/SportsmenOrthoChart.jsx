import React, { useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Регистрируем компоненты графика
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const SportsmenOrthoChart = ({ tests }) => {
    // По умолчанию выбран фильтр "неделя"
    const [filter, setFilter] = useState('week')

    // Опорная дата — максимальная дата из тестов или текущая, если тестов нет
    const referenceDate = useMemo(() => {
        if (tests.length === 0) return new Date()
        return new Date(Math.max(...tests.map((t) => new Date(t.date))))
    }, [tests])

    // Фильтрация данных по диапазону времени, вычисляемому относительно referenceDate
    const filteredTests = useMemo(() => {
        const timeRanges = {
            week: new Date(referenceDate.getTime() - 7 * 24 * 60 * 60 * 1000), // Последняя неделя
            month: new Date(referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000), // Последний месяц
            '3months': new Date(
                referenceDate.getTime() - 90 * 24 * 60 * 60 * 1000
            ), // Последние 3 месяца
            year: new Date(referenceDate.getTime() - 365 * 24 * 60 * 60 * 1000), // Последний год
        }

        return tests.filter((test) => new Date(test.date) >= timeRanges[filter])
    }, [tests, filter, referenceDate])

    // Сортировка отфильтрованных тестов по возрастанию даты
    const sortedTests = useMemo(() => {
        return [...filteredTests].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        )
    }, [filteredTests])

    // Формирование меток для графика: если выбран фильтр "Неделя", отображаем день недели
    const labels = useMemo(() => {
        return sortedTests.map((test) => {
            const date = new Date(test.date)
            return filter === 'week'
                ? date.toLocaleDateString('ru-RU', { weekday: 'short' }) // например, "пн", "вт", ...
                : date.toLocaleDateString('ru-RU')
        })
    }, [sortedTests, filter])

    // Данные для графика
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Результаты тестов',
                data: sortedTests.map((test) => test.result),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3, // Плавность линии
            },
        ],
    }

    return (
        <div className="p-4 bg-card-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
                График результатов тестов
            </h2>

            {/* Фильтр */}
            <div className="flex justify-center gap-2 mb-4">
                {['week', 'month', '3months', 'year'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setFilter(range)}
                        className={`px-4 py-2 rounded-lg ${
                            filter === range ? 'bg-blue' : 'bg-gray'
                        }`}
                    >
                        {range === 'week'
                            ? 'Неделя'
                            : range === 'month'
                              ? 'Месяц'
                              : range === '3months'
                                ? '3 месяца'
                                : 'Год'}
                    </button>
                ))}
            </div>

            {/* График */}
            <Line data={chartData} />
        </div>
    )
}

export default SportsmenOrthoChart
