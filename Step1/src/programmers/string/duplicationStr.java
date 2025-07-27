package programmers.string;

import java.util.Scanner;

public class duplicationStr {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String str = sc.nextLine();
        StringBuilder ans = new StringBuilder();

        for(int i=0; i<str.length();i++){
            if(i == str.indexOf(str.charAt(i))){
                ans.append(str.charAt(i));
            }
        }

        System.out.println(ans.toString());
    }
}
