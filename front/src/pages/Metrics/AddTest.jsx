import React, { useState } from 'react'
import { useUser } from '../../store'
import { initData } from '@telegram-apps/sdk-react'

const AddTest = ({ closeForm }) => {
    const { addOrthoTest, addVolume, getOrthoTest, getVolume } = useUser()
    const [testType, setTestType] = useState(null)
    const [index, setIndex] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!index.trim()) {
            setError('Введите индекс')
            return
        }

        try {
            if (testType === 'ОртоТест') {
                await addOrthoTest(initData.raw(), index)
                getOrthoTest(initData.raw()) // Обновляем данные
            } else if (testType === 'Объем') {
                await addVolume(initData.raw(), index)
                getVolume(initData.raw()) // Обновляем данные
            }

            closeForm() // Закрываем форму после добавления
        } catch (err) {
            setError('Ошибка при добавлении теста')
        }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-card-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Добавить тест</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {!testType ? (
                    // Выбор типа теста
                    <div className="space-y-4">
                        <button
                            onClick={() => setTestType('ОртоТест')}
                            className="w-full px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition"
                        >
                            ОртоТест
                        </button>
                        <button
                            onClick={() => setTestType('Объем')}
                            className="w-full px-4 py-2 bg-green text-white rounded-md hover:bg-green-600 transition"
                        >
                            Объем
                        </button>
                        <button
                            onClick={closeForm}
                            className="w-full px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                        >
                            Отмена
                        </button>
                    </div>
                ) : (
                    // Ввод данных после выбора
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold">{testType}</h3>
                        <input
                            type="text"
                            placeholder="Введите индекс"
                            value={index}
                            onChange={(e) => setIndex(e.target.value)}
                            className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setTestType(null)}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                            >
                                Назад
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Добавить
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AddTest
