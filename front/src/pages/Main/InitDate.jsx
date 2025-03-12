import React from 'react'
import { backButton, useSignal, initData } from '@telegram-apps/sdk-react'
import { useEffect } from 'react'

const InitDate = () => {
    useEffect(() => {
        initData.restore()
        console.log(initData.raw())
    }, [])

    return <div>initData</div>
}

export default InitDate
