import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BackButton from './BackButton'

const Setting = () => {
    const [theme, setTheme] = useState('dark') // Тема по умолчанию - тёмная
    const [language, setLanguage] = useState('ru') // Язык по умолчанию - русский

    useEffect(() => {
        // Получаем тему из localStorage при загрузке компонента
        const savedTheme = localStorage.getItem('theme') || 'dark'
        setTheme(savedTheme)
        // Устанавливаем класс на элемент <html> для работы с Tailwind
        document.body.classList.add(savedTheme)
    }, [])

    // Переключатель темы с сохранением в localStorage
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.body.classList.remove(theme) // Удаляем старую тему
        document.body.classList.add(newTheme) // Добавляем новую тему
    }

    // Обработчик изменения языка
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value)
        // Здесь можно добавить логику по изменению языка в приложении
    }

    return (
        <div
            className={`flex flex-col items-start min-h-screen px-6 py-4 bg-background text-text`}
        >
            <BackButton />
            <h2 className="text-3xl font-bold mb-8">Настройки</h2>

            {/* Переключатель темы */}
            <div className="mb-6">
                <label className="mr-4 font-medium">Тема сайта:</label>
                <button
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 text-white ${
                        theme === 'dark' ? 'bg-blue' : 'bg-gray'
                    }`}
                >
                    {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                </button>
            </div>
        </div>
    )
}

export default Setting
