package programmers.string;

import java.util.Scanner;

//회문문자열 - 펠린드롬 알고리즘
public class palinedromeStr {
    public static void main(String[] args) {
        String answer = "YES";
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        //직접비교
        /*
        str = str.toUpperCase();
        int i=0;
        while (i < str.length()/2){
            if(str.charAt(i)!=str.charAt(str.length()-i-1)){
                answer =  "NO";
            }
            i++;
        }
        */
        //stringBuilder reverse 활용해보기
        String tmp = new StringBuilder(str).reverse().toString();
        if(!str.equalsIgnoreCase(tmp)){
            answer =  "NO";
        }
        System.out.println(answer);

    }
}
