package programmers.string;


import java.util.Scanner;

//단어 뒤집기
//new StringBuilder(str[i]).reverse()
//StringBuilder
//연산이 많을때 사용
public class reverseStr {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int cnt = sc.nextInt();
        sc.nextLine();

        String[] str = new String[cnt];
        String[] reverse = new String[cnt];

        for(int i=0; i<cnt; i++){
            str[i] = sc.nextLine();
            reverse[i] = new StringBuilder(str[i]).reverse().toString();
        }

        for(int i=0; i<cnt; i++){
            System.out.println(reverse[i]);
        }
    }
}
