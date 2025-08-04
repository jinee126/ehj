package programmers.array;

import java.util.Scanner;

public class reverse {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int num  = sc.nextInt();
        sc.nextLine();
        String number[] = new String[num];
        for(int i=0; i<num; i++){
            number[i] = sc.next();
        }
        StringBuilder answer = new StringBuilder();

        for(int j=0; j<num; j++){
            StringBuilder sb = new StringBuilder();
            for(int t=0; t<number[j].length();t++){
               sb.append(number[j].charAt(number[j].length()-t-1));
           }
           int tmp=  Integer.parseInt(sb.toString());
            if(isPrime(tmp)){
                answer.append(tmp).append(" ");
            }

        }
        System.out.println(answer.toString());
    }

    public static boolean isPrime(int num){
        if(num ==1){
            return false;
        }
        for(int i=2; i<num; i++){
            if(num%i == 0){
                return false;
            }
        }

        return true;
    }
}
