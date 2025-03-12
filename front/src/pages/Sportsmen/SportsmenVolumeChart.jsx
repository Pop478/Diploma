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

const SportsmenVolumeChart = ({ volumes }) => {
    const actual_volume = volumes.actual_volume
    const planned_volume = volumes.planned_volume
    const [filter, setFilter] = useState('week')

    // Опорная дата (последняя дата из данных или текущая)
    const referenceDate = useMemo(() => {
        const allDates = [...actual_volume, ...planned_volume].map(
            (v) => new Date(v.date)
        )
        return allDates.length > 0
            ? new Date(Math.max(...allDates))
            : new Date()
    }, [actual_volume, planned_volume])

    // Фильтрация данных по диапазону времени
    const filteredActual = useMemo(() => {
        const timeRanges = {
            week: new Date(referenceDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            month: new Date(referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000),
            '3months': new Date(
                referenceDate.getTime() - 90 * 24 * 60 * 60 * 1000
            ),
            year: new Date(referenceDate.getTime() - 365 * 24 * 60 * 60 * 1000),
        }

        return actual_volume.filter(
            (v) => new Date(v.date) >= timeRanges[filter]
        )
    }, [actual_volume, filter, referenceDate])

    const filteredPlanned = useMemo(() => {
        const timeRanges = {
            week: new Date(referenceDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            month: new Date(referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000),
            '3months': new Date(
                referenceDate.getTime() - 90 * 24 * 60 * 60 * 1000
            ),
            year: new Date(referenceDate.getTime() - 365 * 24 * 60 * 60 * 1000),
        }

        return planned_volume.filter(
            (v) => new Date(v.date) >= timeRanges[filter]
        )
    }, [planned_volume, filter, referenceDate])

    // Сортировка данных по дате
    const sortedActual = useMemo(() => {
        return [...filteredActual].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        )
    }, [filteredActual])

    const sortedPlanned = useMemo(() => {
        return [...filteredPlanned].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        )
    }, [filteredPlanned])

    // Формирование подписей на оси X
    const labels = useMemo(() => {
        const allDates = [...sortedActual, ...sortedPlanned].map(
            (v) => new Date(v.date)
        )
        return [
            ...new Set(
                allDates.map((date) => date.toISOString().split('T')[0])
            ),
        ]
    }, [sortedActual, sortedPlanned])

    // Данные для графика
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Актуальный объем',
                data: labels.map((date) => {
                    const value = sortedActual.find((v) =>
                        v.date.startsWith(date)
                    )
                    return value ? Number(value.actual_volume) : null
                }),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Планируемый объем',
                data: labels.map((date) => {
                    const value = sortedPlanned.find((v) =>
                        v.date.startsWith(date)
                    )
                    return value ? Number(value.planned_volume) : null
                }),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
        ],
    }

    return (
        <div className="p-4 bg-card-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
                График объема тренировок
            </h2>

            {/* Кнопки переключения фильтра */}
            <div className="flex justify-center gap-2 mb-4">
                {['week', 'month', '3months', 'year'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setFilter(range)}
                        className={`px-4 py-2 rounded-lg ${
                            filter === range
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-black'
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

export default SportsmenVolumeChart
