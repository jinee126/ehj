import { httpClient } from '@/api/http-client' // ⚠️ 실제 axios 인스턴스 경로 확인 필요 (withCredentials: true 설정 여부도 확인)

type PostAuthSessionParams = {
  refreshToken: string
}

// ⚠️ 엔드포인트 이름은 기존 기획(/auth/login)을 그대로 가져왔지만,
// 역할이 "로그인 자체"가 아니라 "refreshToken을 받아서 httpOnly 쿠키로 Set-Cookie"로 바뀌었음.
// 백엔드 팀과 이름/스펙 재확인 필요 (예: /auth/session 으로 변경 고려 가능).
export function postAuthSession(params: PostAuthSessionParams) {
  return httpClient.post('/auth/login', params)
}
