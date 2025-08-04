package programmers.array;

import java.util.Arrays;
import java.util.Scanner;

public class showStudent {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int tot = sc.nextInt();
        sc.nextLine();
        String stdStr = sc.nextLine();
        String[] students = stdStr.split(" ");

        int max = Integer.parseInt(students[0]);

        int cnt=1;
        for(int i=1;i<students.length;i++){
            int a =  Integer.parseInt(students[i]);
            if(max<a){
                cnt++;
                max=a;
            }
        }

        System.out.println(cnt);

    }

}
