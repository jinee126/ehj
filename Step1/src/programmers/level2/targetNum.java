package programmers.level2;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class targetNum {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer sc = new StringTokenizer(br.readLine(),",");

        int tot = sc.countTokens();

        int num[] = new int[tot];
        for(int i=0; i<tot; i++){
            num[i] = Integer.parseInt(sc.nextToken());
        }
        int target = Integer.parseInt(br.readLine());
        solution(num,target);
        System.out.println(answer);
    }

    static int answer = 0;
    public static int solution(int[] numbers, int target) {

        dfs(numbers,target,0,0);

        return answer;
    }

    public static void dfs(int[] numbers, int target, int index, int sum) {

        if (index == numbers.length) {
            if (sum == target) answer++;
            return;
        }
        dfs(numbers, target, index + 1, sum + numbers[index]);

        dfs(numbers, target, index + 1, sum - numbers[index]);


    }
}


