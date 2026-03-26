package daily.M_202603;

import java.util.ArrayList;
import java.util.Scanner;
import java.util.Stack;

public class DAY_20260326 {
    public static void main(String[] args) {
        int[]  arr = {1,3,2,4,2};
        solution(arr);
    }
    
    //level1.직사각형별찍기
    public void  solution1() {
        int a =5;
        int b = 5;
        int line =1;
            while(line<=b){
                for(int i=0;i<a; i++){
                    System.out.print("*");
                }
                System.out.println();
                line++;
            }
    }

    //level1. 같은수는 싫어
    public static int[] solution1(int[] a) {
        ArrayList<Integer> list = new ArrayList<Integer>();
        int basic = a[0];
        list.add(a[0]);
        for(int i=1; i<a.length;i++){
            if(basic!=a[i]){
                list.add(a[i]);
            }
            basic = a[i];
        }
        int[]   answer =  list.stream().mapToInt(i->i).toArray();
        return answer;
    }

    //level1. 같은수는 싫어(스택)
    public static int[] solution2(int[] a) {
        Stack <Integer> stack = new Stack<>();
        stack.push(a[0]);
        for(int i=1; i<a.length;i++) {
            if (stack.peek() != a[i]) {
                stack.push(a[i]);
            }
        }
        int[]   answer =  stack.stream().mapToInt(i->i).toArray();
        return answer;
    }

    //level1.숫자문자열과영단어
    //와...
    public static int solution3(String s) {
        String[] num = {"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"};

        //숫자가 0~9까지 10개로 정해져 있으므로 i<10
        for(int i=0; i<10; i++){
            s = s.replace(num[i], Integer.toString(i));
        }

        int answer = Integer.parseInt(s);
        return answer;
    }

    //level1.모의고사
    public static int[] solution(int[] answers) {
        ArrayList<Integer> answer = new ArrayList<Integer>();

        int[] p1 = {1,2,3,4,5};
        int[] p2 = {2,1,2,3,2,4,2,5};
        int[] p3 = {3,3,1,1,2,2,4,4,5,5};

        int p1_cnt = 0;
        int p2_cnt = 0;
        int p3_cnt = 0;

        for(int i=0; i<answers.length; i++){
            p1_cnt += answers[i]==p1[i%5]?1:0;
            p2_cnt += answers[i]==p2[i%8]?1:0;
            p3_cnt += answers[i]==p3[i%10]?1:0;
        }

        int max = Math.max(Math.max(p1_cnt,p2_cnt),p3_cnt);
        System.out.println(max);

        if (p1_cnt == max)  answer.add(1);
        if (p2_cnt == max)  answer.add(2);
        if (p3_cnt == max) answer.add(3);

        System.out.println(answer);

        return answer.stream().mapToInt(i->i).toArray();
    }
}







