package programmers.string;

import java.util.Scanner;

// 두 방향 탐색 알고리즘 문제
public class distanceStr {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        String str[] =sc.nextLine().split(" ");
        String s = str[0];
        char c = str[1].charAt(0);
        //첫번째위치
        /*
        int start =  str[0].indexOf(str[1]);
        int end =0;
        StringBuilder sb = new StringBuilder();
        for(int i=0;i< str[0].length(); i++){
            if( str[0].charAt(i)== str[1].charAt(0)){
                sb.append(0);
                sb.append(" ");
                start = i;
                end = str[0].substring(i+1).indexOf(str[1])+i+1;
            }else{
                if(end==0){
                    sb.append(Math.abs(i-start));
                    sb.append(" ");
                }else{
                    if(Math.abs(i-start) < Math.abs(i-end)){
                        sb.append(Math.abs(i-start));
                        sb.append(" ");
                    }else{
                        sb.append(Math.abs(i-end));
                        sb.append(" ");
                    }
                }
            }
        }
        System.out.println(sb.toString());

        */
        int[] answer = new int[s.length()];
        int p = 1000;

        for(int i=0; i<s.length(); i++){
            if(s.charAt(i) == c){
                p = 0;
                answer[i] = p;
            }
            else{
                p++;
                answer[i] = p;
            }
        }


        p = 1000;

        for(int i=s.length()-1; i>=0; i--){
            if(s.charAt(i) == c){
                p = 0;
            }
            else{
                p++;
                answer[i] = Math.min(answer[i], p);
            }

        }
        for (int a :answer) {
            System.out.print(a+ " ");
        }
    }
}
