import React, { useEffect, useState } from 'react'
import { initData } from '@telegram-apps/sdk-react'
import { useUser } from '../../store'
import Error from '../../Error'
import Loading from '../../Loading'

const MyTrainer = ({ myTrainer }) => {
    const { myTrainerInfo, getMyTrainer, error, loading } = useUser()
    const [fetched, setFetched] = useState(false) // Флаг для предотвращения повторных запросов

    useEffect(() => {
        if (myTrainer && !fetched) {
            // Запрос только если myTrainer есть и еще не запрашивали
            getMyTrainer(initData.raw(), myTrainer).then(() => setFetched(true))
        }
    }, [myTrainer, fetched, getMyTrainer])

    console.log(myTrainer)

    // Проверка загрузки
    if (loading) {
        return <Loading />
    }

    // Проверка ошибки
    if (error) {
        return <Error />
    }

    // Проверка наличия данных о тренере
    if (
        !myTrainerInfo ||
        !myTrainerInfo.first_name ||
        !myTrainerInfo.last_name
    ) {
        return (
            <p className="text-gray-500 text-center">
                Данные о тренере отсутствуют
            </p>
        )
    }

    return (
        <div className="p-4 bg-card-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Мой тренер</h2>
            <p className="text-blue-500 font-medium">
                {myTrainerInfo.first_name} {myTrainerInfo.last_name}
            </p>
        </div>
    )
}

export default MyTrainer
