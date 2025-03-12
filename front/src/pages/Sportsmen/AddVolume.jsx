import React, { useState } from 'react'
import { useUser } from '../../store'
import { initData } from '@telegram-apps/sdk-react'

const AddVolume = ({ closeForm }) => {
    const { addPlannedVolume, getPlannedVolume, error, loading } = useUser()
    const [volume, setVolume] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!volume.trim()) {
            setError('Введите объем')
            return
        }

        try {
            await addPlannedVolume(initData.raw(), volume)
            await getPlannedVolume(initData.raw()) // Обновляем данные после добавления
            closeForm() // Закрываем форму после успешного добавления
        } catch (err) {
            console.log('Ошибка при добавлении объема')
        }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-card-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    Добавить планируемый объем
                </h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        placeholder="Введите объем"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddVolume
