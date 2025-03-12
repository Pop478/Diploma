import React from 'react'

const SportsmenProfile = ({ user }) => {
    if (!user) {
        return <p>Загрузка данных...</p>
    }

    return (
        <div className="p-4 bg-card-white shadow-md rounded-lg max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">Профиль спортсмена</h2>
            <p>
                <strong>Имя:</strong> {user.first_name}
            </p>
            <p>
                <strong>Фамилия:</strong> {user.last_name}
            </p>
            <p>
                <strong>Дата рождения:</strong>{' '}
                {new Date(user.birth_date).toLocaleDateString()}
            </p>
            <p>
                <strong>Группа:</strong> {user.group_id}
            </p>
            <p>
                <strong>Разряд:</strong> {user.rank}
            </p>

            {/* <p>
                <strong>User ID:</strong> {user.user_id}
            </p> */}
            {/* <p>
                <strong>UUID:</strong> {user.uuid ? user.uuid : 'Нет данных'}
            </p> */}
        </div>
    )
}

export default SportsmenProfile
