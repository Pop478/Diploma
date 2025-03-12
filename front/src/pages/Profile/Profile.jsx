import React, { useEffect, useState } from 'react'
import { useUser } from '../../store'
import { initData } from '@telegram-apps/sdk-react'
import Error from '../../Error'
import Loading from '../../Loading'
import TrainerStatus from './TrainerStatus'
import Edit from '../../assets/edit.svg'
import MyTrainer from './MyTrainer'

const Profile = () => {
    const { me, getMe, patchMe, error, loading } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        rank: '',
    })

    useEffect(() => {
        getMe(initData.raw())
    }, [getMe])

    useEffect(() => {
        if (me) {
            setFormData({
                first_name: me.first_name || '',
                last_name: me.last_name || '',
                birth_date: me.birth_date ? me.birth_date.split('T')[0] : '', // Форматируем дату
                rank: me.rank || '',
            })
        }
    }, [me])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSave = async () => {
        try {
            await patchMe(initData.raw(), {
                ...formData,
                birth_date: formData.birth_date || null, // Просто передаем строку "YYYY-MM-DD"
            })

            await getMe(initData.raw()) // Обновляем данные после сохранения
            setIsEditing(false)
        } catch (error) {
            console.error('Ошибка:', error)
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="bg-background flex flex-col min-h-screen p-2 text-text gap-3">
            <div className="bg-card-white shadow-lg rounded-2xl p-3 w-full max-w-md">
                <h1 className="text-xl font-bold text-center mb-4">Профиль</h1>
                {me ? (
                    <>
                        <div className="text-center">
                            <img
                                src={`http://localhost:5000/user_${me.uuid}.png`}
                                alt="Аватар"
                                className="w-24 h-24 rounded-full mx-auto mb-4 border border-gray-300"
                            />
                        </div>
                        <div className="bg-background text-lg flex flex-col justify-start gap-3 rounded-xl">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="bg-card-white border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="bg-card-white border p-2 rounded"
                                    />
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={
                                            formData.birth_date
                                                ? formData.birth_date.split(
                                                      'T'
                                                  )[0]
                                                : ''
                                        } // Убираем время и UTC
                                        onChange={handleChange}
                                        className="bg-card-white border p-2 rounded"
                                    />

                                    <select
                                        name="rank"
                                        value={formData.rank}
                                        onChange={handleChange}
                                        className="bg-card-white border p-2 rounded"
                                    >
                                        <option value="">
                                            Выберите разряд
                                        </option>
                                        <option value="1 взрослый">
                                            1 взрослый
                                        </option>
                                        <option value="2 взрослый">
                                            2 взрослый
                                        </option>
                                        <option value="3 взрослый">
                                            3 взрослый
                                        </option>
                                        <option value="КМС">КМС</option>
                                        <option value="МС">МС</option>
                                        <option value="МСМК">МСМК</option>
                                    </select>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={handleSave}
                                            className="bg-green text-white p-2 rounded mt-2"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false)
                                            }}
                                            className="bg-blue text-white p-2 rounded mt-2"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-3">
                                    <div className="flex gap-4">
                                        <p>{me.first_name || 'Нет имени'}</p>
                                        <p>{me.last_name || 'Нет фамилии'}</p>
                                    </div>

                                    <p>
                                        {me.birth_date
                                            ? new Date(
                                                  me.birth_date
                                              ).getFullYear() +
                                              '-' +
                                              String(
                                                  new Date(
                                                      me.birth_date
                                                  ).getMonth() + 1
                                              ).padStart(2, '0') +
                                              '-' +
                                              String(
                                                  new Date(
                                                      me.birth_date
                                                  ).getDate()
                                              ).padStart(2, '0')
                                            : 'Нет дня рождения'}
                                    </p>
                                    <div className="flex justify-between">
                                        {' '}
                                        <p>{me.rank || 'Нет разряда'}</p>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 text-blue-500"
                                        >
                                            <img
                                                src={Edit}
                                                alt="Редактировать"
                                                className="w-5 h-5"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-center">Нет данных</p>
                )}
            </div>
            {/* <MyTrainer myTrainer={me.trainer_id} /> */}
            <TrainerStatus trainer={me.trainer} />
        </div>
    )
}

export default Profile
