import React from 'react'
import { Link } from 'react-router-dom'

const SportsmenItem = ({ firstName, lastName, rank, birthDate, user_id }) => {
    return (
        <Link
            to={`/athlete/${user_id}`}
            className="text px-4 py-2 rounded-lg shadow-md bg-card-white flex flex-col"
        >
            <h2 className="text-base font-semibold">
                {firstName} {lastName}
            </h2>
            <p className="">Разряд: {rank}</p>
            {birthDate && (
                <p className="text-sm">
                    Дата рождения: {new Date(birthDate).toLocaleDateString()}
                </p>
            )}
        </Link>
    )
}

export default SportsmenItem
