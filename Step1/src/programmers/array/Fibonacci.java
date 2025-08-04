package programmers.array;

import java.util.Scanner;

public class Fibonacci {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cnt  = sc.nextInt();


        int num[] = new int[cnt];
        num[0] = 1;
        num[1] = 1;
        for(int i=2;i<num.length;i++){
            num[i] = num[i-1]+num[i-2];
        }
        for(int i=0;i<num.length;i++){
            System.out.print(num[i]+" ");
        }



    }
}
