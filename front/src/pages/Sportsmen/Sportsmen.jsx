import { backButton, initData } from '@telegram-apps/sdk-react'
import { useParams } from 'react-router-dom'
import { useUser } from '../../store'
import SportsmenOrthoTestItem from './SportsmenOrthoTestItem'
import SportsmenOrthoChart from './SportsmenOrthoChart'
import SportsmenVolumeChart from './SportsmenVolumeChart' // Импортируем график объема
import SportsmenProfile from './SportsmenProfile'
import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton'

const Sportsmen = () => {
    const {
        getUser,
        userOrthoTest,
        getUserOrthoTest,
        getUserVolume,
        userPlannedVolume,
        user,
        error,
        loading,
    } = useUser()
    const { athleteId } = useParams()
    const [activeChart, setActiveChart] = useState('pulse') // По умолчанию Пульс

    useEffect(() => {
        getUser(initData.raw(), athleteId)
        if (athleteId) {
            getUserOrthoTest(initData.raw(), athleteId)
            getUserVolume(initData.raw(), athleteId)
        }
    }, [athleteId, getUserOrthoTest])

    if (loading) {
        return <p>Загрузка...</p>
    }

    if (error) {
        return <p className="text-red-500">Ошибка загрузки данных</p>
    }

    return (
        <div className="p-3 bg-background min-h-screen">
            <BackButton />
            <SportsmenProfile user={user} />

            {/* Кнопки переключения */}
            <div className="flex justify-center gap-4 my-4">
                <button
                    className={`px-4 py-2 rounded-md transition ${
                        activeChart === 'pulse'
                            ? 'bg-blue text-white'
                            : 'bg-gray text-black'
                    }`}
                    onClick={() => setActiveChart('pulse')}
                >
                    Пульс
                </button>
                <button
                    className={`px-4 py-2 rounded-md transition ${
                        activeChart === 'volume'
                            ? 'bg-blue text-white'
                            : 'bg-gray text-black'
                    }`}
                    onClick={() => setActiveChart('volume')}
                >
                    Объем
                </button>
            </div>

            {/* Отображение графиков */}
            {activeChart === 'pulse' ? (
                <SportsmenOrthoChart tests={userOrthoTest} />
            ) : (
                <SportsmenVolumeChart volumes={userPlannedVolume} />
            )}

            {/* Отображение тестов */}
            {userOrthoTest && userOrthoTest.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    {userOrthoTest.map((test) => (
                        <SportsmenOrthoTestItem
                            key={test.id}
                            result={test.result}
                            date={test.date}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Тестов пока нет</p>
            )}
        </div>
    )
}

export default Sportsmen
