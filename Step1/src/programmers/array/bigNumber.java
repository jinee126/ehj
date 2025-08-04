package programmers.array;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class bigNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tot = sc.nextInt();
        sc.nextLine();
        String numbers = sc.nextLine();
        String[] num = numbers.split(" ");

        //int num[] = new int[]{numbers.split(" ")};

        StringBuilder sb = new StringBuilder();
        //int std = num[0];
        sb.append( num[0]).append(" ");
        for(int i=1; i<num.length;i++){
            if(Integer.parseInt(num[i])>=Integer.parseInt(num[i-1])){
                sb.append(num[i]).append(" ");
            }
        }
        System.out.println(sb.toString());


    }
}
