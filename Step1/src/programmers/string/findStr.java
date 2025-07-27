package programmers.string;

import java.util.Scanner;

//한 개의 문자열을 입력받고, 특정 문자를 입력받아 해당 특정문자가 입력받은 문자열에 몇 개 존재
//charAt
public class findStr {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String str= sc.nextLine();
        String findStr = sc.nextLine();
        int a=0;
        for(int i=0; i<str.length(); i++){
            if(str.toUpperCase().charAt(i) == findStr.toUpperCase().charAt(0)){
                a++;
            }
        }
        System.out.println(a);
    }
}
