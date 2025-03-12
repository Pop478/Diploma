import React, { useEffect, useState } from 'react'
import { useUser } from '../../store'
import { initData } from '@telegram-apps/sdk-react'
import Error from '../../Error'
import Loading from '../../Loading'
import SportsmenItem from '../Sportsmen/SportsmenItem'
import Add from '../../assets/add.svg'
import AddVolume from '../Sportsmen/AddVolume'

const Groups = () => {
    const { group, getGroups, error, loading } = useUser()
    const [showAddTest, setShowAddTest] = useState(false)

    useEffect(() => {
        getGroups(initData.raw())
    }, [getGroups])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="bg-background p-3 min-h-screen">
            <div className="absolute bottom-16 right-5">
                <button
                    onClick={() => setShowAddTest(!showAddTest)}
                    className="bg-green p-3 rounded-xl shadow-md transition"
                >
                    <img src={Add} alt="Добавить тест" className="w-8 h-8" />
                </button>
            </div>

            {showAddTest && (
                <AddVolume closeForm={() => setShowAddTest(false)} />
            )}
            {group && group.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.map((sportsman) => (
                        <SportsmenItem
                            key={sportsman.user_id}
                            user_id={sportsman.user_id}
                            firstName={sportsman.first_name}
                            lastName={sportsman.last_name}
                            rank={sportsman.rank}
                            birthDate={sportsman.birth_date}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    <p className="text-center text-gray-500">У вас нет групп</p>
                </div>
            )}
        </div>
    )
}

export default Groups
