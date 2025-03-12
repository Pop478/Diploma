import { create } from 'zustand'

export const handleServerResponse = async (response, set) => {
    const { setSessionExpired } = useUser.getState() // Получаем метод из хранилища

    if (response.status === 401) {
        setSessionExpired(true) // Устанавливаем состояние истечения сессии
        return null
    }

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
    }

    return await response.json()
}

export const useUser = create((set) => ({
    sessionExpired: false, // Состояние для модального окна сессии
    setSessionExpired: (value) => set({ sessionExpired: value }), // Метод для обновления состояния сиссии
    theme: 'light', // начальное значение темы по умолчанию
    setTheme: (newTheme) => set({ theme: newTheme }), // метод для смены темы
    trainer: [],
    me: [],
    user: [],
    orthoTest: [],
    userOrthoTest: [],
    group: [],
    volume: [],
    plannedVolume: [],
    userPlannedVolume: [],
    myTrainerInfo: [],

    fetchAuth: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('http://localhost:5000/auth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            const data = await handleServerResponse(response, set)
            set({ loading: false })
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getTrainer: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('http://localhost:5000/trainer', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                set({ trainer: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ trainer: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getMe: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('http://localhost:5000/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                set({ me: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ me: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getUser: async (initDataRaw, athleteId) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/user/${athleteId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                set({ user: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ user: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    patchMe: async (initDataRaw, formData) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:5000/user/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify(formData), // Убираем лишний объект { formData }
            })

            if (response.status === 204) {
                set({ loading: false })
                return []
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getOrthoTest: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('http://localhost:5000/tests/ortho', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                set({ orthoTest: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ orthoTest: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getUserOrthoTest: async (initDataRaw, athlete_id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/tests/ortho/${athlete_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                set({ userOrthoTest: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ userOrthoTest: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getVolume: async (initDataRaw, athleteId) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`http://localhost:5000/volume`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                set({ volume: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ volume: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    addVolume: async (initDataRaw, index) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/volume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({
                    index,
                }),
            })

            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ loading: false })
                return []
            }

            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },

    getPlannedVolume: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/volume/planned`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                set({ plannedVolume: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ plannedVolume: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    addPlannedVolume: async (initDataRaw, volume) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                'http://localhost:5000/volume/planned',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({
                        volume,
                    }),
                }
            )

            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ loading: false })
                return []
            }

            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },

    getUserVolume: async (initDataRaw, athlete_id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/volume/planned/${athlete_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                set({ userPlannedVolume: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ userPlannedVolume: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    getGroups: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('http://localhost:5000/group', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                set({ group: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ group: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },

    addOrthoTest: async (initDataRaw, index) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/tests/ortho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({
                    index,
                }),
            })

            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ loading: false })
                return []
            }

            if (response.status === 409) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ loading: false })
                alert('На сегодня уже есть запись')
                return []
            }

            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },

    becomeTrainer: async (initDataRaw) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                'http://localhost:5000/trainer/become',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                set({ loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },
    getMyTrainer: async (initDataRaw, myTrainer) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/trainer/my/${myTrainer}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                set({ myTrainerInfo: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
            set({ myTrainerInfo: data, loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
        }
    },
}))
