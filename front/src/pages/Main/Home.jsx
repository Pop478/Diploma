import React, { useEffect, useState } from 'react'
import { backButton, useSignal, initData } from '@telegram-apps/sdk-react'
import { useUser } from '../../store'
import Loading from '../../Loading'
import Error from '../../Error'

const Home = () => {
    const { trainer, fetchAuth, getTrainer, error, loading } = useUser()
    const [button, setButton] = useState(false)
    useEffect(() => {
        fetchAuth(initData.raw())
        getTrainer(initData.raw())
    }, [getTrainer, initData])

    const toggleBackButton = () => {
        if (button) {
            backButton.hide()
        } else {
            backButton.show()
        }
        setButton(!button)
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }
    console.log(trainer)

    return (
        <div>
            Тут кнопка{' '}
            <button onClick={toggleBackButton} className="bg-red p-2">
                {button ? 'Скрыть BackButton' : 'Показать BackButton'}
            </button>
            {trainer.map((trainer) => (
                <div key={trainer.id} className="p-2 border-b border-gray-300">
                    {trainer.first_name} {trainer.last_name}
                </div>
            ))}
        </div>
    )
}

export default Home
