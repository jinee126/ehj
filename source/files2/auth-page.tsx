import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { fetchAuthSession } from 'aws-amplify/auth'
import SignIn from '@/pages/auth/sign-in.tsx'

export default function AuthPage() {
    const navigate = useNavigate()
    const [isAuthChecked, setIsAuthChecked] = useState(false)

    // 이미 유효한 Amplify 세션이 있으면 로그인 폼을 보여줄 필요 없이 대시보드로 보냄
    useEffect(() => {
        fetchAuthSession()
            .then((session) => {
                const accessToken = session.tokens?.accessToken?.toString()

                if (accessToken) {
                    navigate('/') // ⚠️ 대시보드 경로, router.tsx 기준 재확인
                    return
                }

                setIsAuthChecked(true)
            })
            .catch(() => {
                setIsAuthChecked(true)
            })
    }, [navigate])

    if (!isAuthChecked) {
        return null // 필요하면 로딩 스피너로 교체
    }

    return (
        <div className="login-wrap">
            <div className="container">
                <h1 className="logo-img">API PORTAL</h1>
                <main className="content">
                    <SignIn />
                </main>
            </div>
        </div>
    )
}