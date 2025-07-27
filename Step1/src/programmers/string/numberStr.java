package programmers.string;

import java.util.Scanner;

public class numberStr {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str= sc.nextLine();

        StringBuilder sb = new StringBuilder();
        for(int i=0; i<str.length();i++){
            if(!Character.isAlphabetic(str.charAt(i))){
                sb.append(str.charAt(i));
            }
        }
        System.out.println(Long.parseLong(sb.toString()));
    }
}
