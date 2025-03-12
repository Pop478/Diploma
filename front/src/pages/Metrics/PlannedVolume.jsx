import React from 'react'
import { useUser } from '../../store'
import Loading from '../../Loading'
import Error from '../../Error'

const PlannedVolume = () => {
    const { plannedVolume, error, loading } = useUser()

    if (loading) return <Loading />
    if (error) return <Error />

    // Получаем volume из объекта, если данные существуют
    const totalPlannedVolume =
        plannedVolume?.length > 0 ? parseFloat(plannedVolume[0].volume) : 0

    return (
        <div className="p-4 bg-card-white rounded-md shadow-md">
            <h2 className="text-base font-semibold">Планированный объем</h2>
            <p className="text-xl font-bold">{totalPlannedVolume.toFixed(2)}</p>
        </div>
    )
}

export default PlannedVolume
