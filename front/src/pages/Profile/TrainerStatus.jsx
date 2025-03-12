import React, { useState } from 'react'
import { useUser } from '../../store'
import { initData } from '@telegram-apps/sdk-react'

const TrainerStatus = ({ trainer }) => {
    const { becomeTrainer, getMe } = useUser()
    const [isBecomingTrainer, setIsBecomingTrainer] = useState(false)

    const handleBecomeTrainer = () => {
        setIsBecomingTrainer(true)
    }

    const confirmTrainerStatus = async (isConfirmed) => {
        if (isConfirmed) {
            await becomeTrainer(initData.raw())
            await getMe(initData.raw())
        }
        setIsBecomingTrainer(false)
    }

    return (
        <div className="p-4 rounded-lg bg-card-white shadow-md text-center">
            {trainer ? (
                <p className="text-green-600 font-bold">Вы тренер</p>
            ) : (
                <>
                    <p className="text-red-600">Вы не тренер</p>
                    <button
                        onClick={handleBecomeTrainer}
                        className="bg-blue px-4 py-2 rounded mt-2"
                    >
                        Стать тренером
                    </button>
                </>
            )}

            {/* Модальное окно */}
            {isBecomingTrainer && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <p className="text-lg font-semibold mb-4">
                            Вы уверены, что хотите стать тренером?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => confirmTrainerStatus(true)}
                                className="bg-green px-4 py-2 rounded"
                            >
                                Да
                            </button>
                            <button
                                onClick={() => confirmTrainerStatus(false)}
                                className="bg-red px-4 py-2 rounded"
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrainerStatus
