package programmers.slidingWindows;

import java.util.Scanner;

public class sequenceSum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int find = sc.nextInt();
        int numbers[] = new int[n];
        for(int i=0;i<n;i++){
            numbers[i] = sc.nextInt();
        }

        //
        int start =0;
        int end =0;
        int cnt =0;
        int sum = 0;
        while(end<n){
            sum+=numbers[end];
            end++;

            while(sum > find && start<end){
                sum-=numbers[start];
                start++;
            }
            if(sum == find){
                cnt++;
            }

        }

        System.out.println(cnt);


    }
}
