package programmers.string;

import java.util.Scanner;

public class compressStr {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();

        StringBuilder sb = new StringBuilder();

        //char ch = str.charAt(0);
        str = str+" ";
        int cnt = 1;
        for(int i=0; i<str.length()-1; i++){
            if(str.charAt(i) == str.charAt(i+1)){
                cnt++;
            }else{
                sb.append(str.charAt(i));
                if(cnt>1){
                    sb.append(cnt);
                    cnt=1;
                }
            }
        }
        System.out.println(sb.toString());
    }
}
