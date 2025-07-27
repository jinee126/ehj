package programmers.string;

import java.util.Scanner;

public class specialStr {
    public static void  main(String[] args){
        Scanner sc =new Scanner(System.in);

        String str = sc.nextLine();

        int lt=0;
        int rt = str.length()-1;
        char ch[] = str.toCharArray();

        char tmp ;
        while(lt<rt){

           if(!Character.isAlphabetic(ch[lt])) lt++;
           else if(!Character.isAlphabetic(ch[rt])) rt--;
           else {
               tmp = ch[lt];
               ch[lt] = ch[rt];
               ch[rt] = tmp;
               lt++;
               rt--;
           }


        }
        String answer = String.valueOf(ch);
        System.out.println(answer);

    }
}
