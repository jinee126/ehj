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
        StringBuilder anwwer = new StringBuilder();

        for(int j=0; j<num; j++){
            StringBuilder sb = new StringBuilder();
           for(int t=0; t<number[j].length();t++){
               sb.append(number[j].charAt(number[j].length()-t-1));
           }
           int tmp=  Integer.parseInt(sb.toString());



        }
        System.out.println(anwwer.toString());
    }
}
