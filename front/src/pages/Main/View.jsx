import React, { useEffect, useState } from 'react'
import { viewport } from '@telegram-apps/sdk-react'

const View = () => {
    const [isMounted, setIsMounted] = useState(viewport.isMounted()) // Проверяем, смонтирован ли вьюпорт
    const [isFullscreen, setIsFullscreen] = useState(viewport.isFullscreen()) // Проверяем полноэкранный режим

    useEffect(() => {
        const mountViewport = async () => {
            if (!isMounted && viewport.mount.isAvailable()) {
                try {
                    await viewport.mount()
                    setIsMounted(viewport.isMounted()) // Устанавливаем состояние после монтирования
                } catch (error) {
                    console.error('Ошибка монтирования viewport:', error)
                }
            }
        }

        mountViewport()
    }, [isMounted]) // Следим за состоянием монтирования

    const toggleViewport = async () => {
        if (isFullscreen) {
            if (viewport.exitFullscreen.isAvailable()) {
                await viewport.exitFullscreen()
            }
        } else {
            if (viewport.requestFullscreen.isAvailable()) {
                await viewport.requestFullscreen()
            }
        }
        setIsFullscreen(viewport.isFullscreen()) // Обновляем состояние
    }

    return (
        <div>
            <p>View Тут</p>
            <button onClick={toggleViewport} disabled={!isMounted}>
                {isFullscreen ? 'Свернуть' : 'Развернуть'}
            </button>
        </div>
    )
}

export default View
