package daliy.m_202604;

public class DAY_20260402 {
    public static void main(String[] args) {
        int n = 4;
        long a = solution(n);
        System.out.println(a);
    }

    //멀리뛰기- 피보나치수열
    public static long solution(int n) {
        long answer = 0;
        long list[] = new long[n+2];
        list[1] = 1;
        list[2] = 2;
        for(int i=3; i<=n;i++){
            list[i] = (list[i-1] + list[i-2])% 1234567; // 계산당시 그냥 넣으면 틀리는데, 아마도 stackflow 나는것 같다
        }
        return  list[n] ;
    }

    //




}







