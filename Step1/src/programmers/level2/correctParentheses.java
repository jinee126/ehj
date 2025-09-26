package programmers.level2;

import java.util.Scanner;
import java.util.Stack;

public class correctParentheses {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();

        boolean answer = true;
        Stack<String> st = new Stack<String>();
        for(int i=0; i<s.length(); i++){

            if("(".equals(s.substring(i,i+1))){
                st.push(s.substring(i,i+1));
            }else {
                if (st.isEmpty()) {
                    answer = false;
                    break;
                }
                st.pop();
            }
        }
        if(!st.isEmpty()){
            answer = false;
        }
        System.out.println(answer);

    }
}
