// ⚠️ 최상단 import 일부는 스크린샷에 안 잡혀서 안 보였음. 사용된 흔적 기준으로 추정해서 채움.
import axios, { type AxiosError } from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { $accessToken } from '@/stores/...' // 실제 경로 확인 필요
import { signOutWithAmplify } from '@/utils/amplify-auth'
import type { ApiResponse } from '@/types/...' // 실제 경로 확인 필요

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
})

// Request interceptor
api.interceptors.request.use((config) => {
    // ⚠️ 이 분기는 "옛 백엔드 로그인 흐름" 기준이었음.
    // Cognito 로그인은 이제 Amplify가 이 api 인스턴스를 거치지 않고 직접 처리하므로,
    // 이 URL 자체는 더 이상 의미 없을 가능성이 높음.
    // 다만 회원가입/비밀번호 재설정처럼 인증 없이 호출해야 하는 다른 엔드포인트가 있다면
    // 그 목록으로 바꿔서 유지해야 함 — 확인 필요.
    if (config.url === 'api/v1/auth/login') return config

    const token = $accessToken.get()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Response interceptor
let tokenRefreshing: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
    // Amplify가 자체 storage의 refreshToken으로 Cognito와 직접 통신해서 갱신.
    // 백엔드 /reissue-token 호출이 더 이상 필요 없어짐.
    const session = await fetchAuthSession({ forceRefresh: true })
    const newAccessToken = session.tokens?.accessToken?.toString()

    if (!newAccessToken) {
        throw new Error('토큰 갱신에 실패했습니다.')
    }

    return newAccessToken
}

api.interceptors.response.use(
    (response) => response,
    // 서버 에러 응답 캐치 미들웨어
    async ({ response, config }: AxiosError<ApiResponse<null>>) => {
        if (response && config) {
            const errorCode = response.data.error?.errorCode

            // 비밀번호 불일치(USER-302) 제외한 401은 토큰 갱신 후 재요청
            // ⚠️ USER-302가 여전히 발생 가능한 에러코드인지 확인 필요
            // (Cognito가 비밀번호 검증을 하게 되면서 이 코드가 안 쓰일 수도 있음)
            if (response.status === 401 && errorCode !== 'USER-302') {
                try {
                    if (!tokenRefreshing) tokenRefreshing = refreshAccessToken()

                    const newAccessToken = await tokenRefreshing
                    $accessToken.set(newAccessToken)
                    config.headers.Authorization = `Bearer ${newAccessToken}`
                    tokenRefreshing = null

                    return await api(config)
                } catch (refreshError) {
                    // Cognito의 refreshToken까지 만료/무효화된 상태 — 더 이상 갱신 불가
                    tokenRefreshing = null
                    await signOutWithAmplify(false)
                    $accessToken.set(null)
                    // ⚠️ 기존 removeAuth()가 $accessToken 외에 다른 상태($isLocalLogin 등)도
                    // 같이 정리했다면, 그 호출도 여기 같이 넣어야 함 — removeAuth() 구현 확인 필요
                    window.location.href = '/intc/login'
                    return
                }
            }
        }

        return Promise.reject({ response, config })
    },
)