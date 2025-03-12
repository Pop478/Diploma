import React, { useEffect } from 'react'
import Home from './pages/Main/Home'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Test from './pages/Main/Test'
import Layout from './components/Layout'
import { themeParams, settingsButton } from '@telegram-apps/sdk-react'
import { useUser } from './store'
import SessionExpiredModal from './SessionExpiredModal'
import Profile from './pages/Profile/Profile'
import Metrics from './pages/Metrics/Metrics'
import Groups from './pages/Groups/Groups'
import Sportsmen from './pages/Sportsmen/Sportsmen'
import Settings from './components/Settings'

const App = () => {
    const { theme, setTheme, sessionExpired } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        // Проверяем поддержку и монтируем кнопку
        if (settingsButton.mount.isAvailable()) {
            settingsButton.mount()
        }

        // Показываем кнопку
        if (settingsButton.show.isAvailable()) {
            settingsButton.show()
        }

        // Добавляем обработчик клика
        let offClick
        if (settingsButton.onClick.isAvailable()) {
            const handleClick = () => {
                console.log('Settings button clicked!')
                navigate('/settings')
            }
            offClick = settingsButton.onClick(handleClick)
        }

        // Очистка при размонтировании
        return () => {
            if (offClick) {
                offClick() // Убираем обработчик клика
            }
            if (!settingsButton.mount.isAvailable()) {
                settingsButton.unmount() // Размонтируем кнопку
            }
        }
    }, [])

    useEffect(() => {
        // Получаем тему из localStorage при загрузке компонента
        const savedTheme = localStorage.getItem('theme') || 'dark'
        setTheme(savedTheme)

        // Устанавливаем начальный класс на <html> элемент
        document.body.classList.add(savedTheme)
    }, [setTheme])

    return (
        <div className="text-text">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Test />}></Route>

                    <Route path={'profile'} element={<Profile />}></Route>
                    <Route path={'my-metrics'} element={<Metrics />}></Route>
                    <Route path={'my-groups'} element={<Groups />}></Route>
                    <Route path={'group/:groupId'} element={<Home />}></Route>
                    <Route
                        path={'athlete/:athleteId'}
                        element={<Sportsmen />}
                    ></Route>
                    <Route path={'settings'} element={<Settings />}></Route>
                </Route>
            </Routes>
            {sessionExpired && <SessionExpiredModal />}
        </div>
    )
}

export default App
