import React, { useEffect, useState } from 'react'
import { initData } from '@telegram-apps/sdk-react'
import { useUser } from '../../store'
import Loading from '../../Loading'
import Error from '../../Error'

const MyVolume = () => {
    const { volume, error, loading } = useUser()

    if (loading) return <Loading />
    if (error) return <Error />

    // Суммируем volume, учитывая, что данные приходят строками, переводим их в число
    const totalVolume =
        volume?.reduce((sum, item) => sum + parseFloat(item.volume), 0) || 0

    return (
        <div className="p-4 bg-card-white rounded-md shadow-md">
            <h2 className="text-base font-semibold">Мой объем</h2>
            <p className="text-xl font-bold">{totalVolume.toFixed(2)}</p>
        </div>
    )
}

export default MyVolume
