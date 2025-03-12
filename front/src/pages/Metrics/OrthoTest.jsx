import React from 'react'

const OrthoTest = ({ test }) => {
    // Определяем цвет круга в зависимости от результата
    const circleColor =
        test.result < 5
            ? 'bg-red'
            : test.result < 10
              ? 'bg-orange-500'
              : 'bg-green'

    return (
        <div className="bg-card-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">
                Дата: {new Date(test.date).toLocaleDateString()}
            </p>
            <div className="flex gap-3 items-center">
                <p>
                    Результат: <span className="font-bold">{test.result}</span>
                </p>
                <div className={`rounded-full h-4 w-4 ${circleColor}`}></div>
            </div>
        </div>
    )
}

export default OrthoTest
