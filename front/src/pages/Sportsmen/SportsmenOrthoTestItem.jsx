import React from 'react'

const SportsmenOrthoTestItem = ({ result, date }) => {
    const circleColor =
        result < 5 ? 'bg-red' : result < 10 ? 'bg-orange-500' : 'bg-green'

    return (
        <div className="px-4 py-2 rounded-lg shadow-md bg-card-white flex flex-col">
            <p className="text-lg font-semibold">Результат: {result}</p>
            <div className="flex gap-3 items-center">
                <p className="text-sm">
                    Дата теста: {new Date(date).toLocaleDateString()}
                </p>
                <div className={`rounded-full h-4 w-4 ${circleColor}`}></div>
            </div>
        </div>
    )
}

export default SportsmenOrthoTestItem
