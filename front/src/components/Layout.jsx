import React from 'react'
import { Outlet } from 'react-router-dom'
import CustomLink from './CustomLink'
import { useState } from 'react'
import { useEffect } from 'react'
import Groups from '../assets/groups.svg'
import Analitic from '../assets/analitic.svg'
import Profile from '../assets/profile.svg'
import Menu from '../assets/menu.svg'

const Layout = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <Outlet></Outlet>
            <header
                className={`bg-card-white flex justify-evenly gap-3 w-full overflow-hidden z-50 fixed ${
                    isDesktop ? 'top-0' : 'bottom-0'
                }`}
            >
                <CustomLink to={'/my-groups'}>
                    <img src={Groups} alt="Menu" />
                </CustomLink>
                <CustomLink to={'/my-metrics'}>
                    <img src={Analitic} alt="Home" />
                </CustomLink>
                <CustomLink to={'/profile'}>
                    <img src={Profile} alt="Home" />
                </CustomLink>
            </header>
        </>
    )
}

export default Layout
