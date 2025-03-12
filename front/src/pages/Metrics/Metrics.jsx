import React, { useEffect } from 'react'
import { useUser } from '../../store'
import { initData } from '@telegram-apps/sdk-react'
import Error from '../../Error'
import Loading from '../../Loading'
import OrthoTest from './OrthoTest' // Импортируем компонент для отдельного теста
import AddTest from './AddTest'
import { useState } from 'react'
import Add from '../../assets/add.svg'
import MyVolume from './MyVolume'
import PlannedVolume from './PlannedVolume'

const Metrics = () => {
    const {
        orthoTest,
        getOrthoTest,
        getVolume,
        getPlannedVolume,
        error,
        loading,
    } = useUser()
    const [showAddTest, setShowAddTest] = useState(false)

    useEffect(() => {
        getOrthoTest(initData.raw())
        getVolume(initData.raw())
        getPlannedVolume(initData.raw())
    }, [getOrthoTest])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="bg-background flex flex-col items-center min-h-screen p-3 relative">
            <div className="fixed bottom-16 right-5">
                <button
                    onClick={() => setShowAddTest(!showAddTest)}
                    className="bg-green p-3 rounded-xl shadow-md transition"
                >
                    <img src={Add} alt="Добавить тест" className="w-8 h-8" />
                </button>
            </div>

            {showAddTest && <AddTest closeForm={() => setShowAddTest(false)} />}

            <div className="shadow-lg rounded-2xl p-3 w-full max-w-md">
                <h1 className="text-xl font-bold text-center mb-2">
                    Результаты тестов
                </h1>
                <div className="grid grid-cols-2 gap-4">
                    <PlannedVolume />
                    <MyVolume />
                </div>
                {orthoTest && orthoTest.length > 0 ? (
                    <div className="space-y-4 mt-3">
                        {orthoTest
                            .slice() // Создаём копию массива, чтобы не мутировать исходный
                            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Сортировка по дате (сначала новые)
                            .map((test) => (
                                <OrthoTest key={test.id} test={test} />
                            ))}
                    </div>
                ) : (
                    <p className="text-center ">Нет результатов</p>
                )}
            </div>
        </div>
    )
}

export default Metrics
