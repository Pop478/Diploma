import { Link, useMatch } from 'react-router-dom'
import React from 'react'

const CustomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)

    return (
        <Link
            to={to}
            className={`p-3 rounded-lg ${match ? 'text-green' : ''}`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default CustomLink
