package programmers.string;

import java.util.Scanner;

public class codeStr {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cnt = sc.nextInt();
        sc.nextLine();
        String str = sc.nextLine();


        StringBuilder sb = new StringBuilder();
       for(int i=0; i< cnt; i++){

          String tmp  = str.substring(i*7,i*7+7).replace("#","1").replace("*","0");

          int num  = Integer.parseInt(tmp,2);

          sb.append((char)num);
       }
        System.out.println(sb.toString());

    }
}
