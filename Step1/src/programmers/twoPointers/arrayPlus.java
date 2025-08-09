package programmers.twoPointers;

import java.util.ArrayList;
import java.util.Scanner;

public class arrayPlus {
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);

        int num1 = sc.nextInt();
        int one[] = new int[num1];
        for(int i=0;i<num1;i++){
            one[i]=sc.nextInt();
        }
        int num2=sc.nextInt();
        int two[] = new int[num2];
        for(int i=0;i<num2;i++){
            two[i]=sc.nextInt();
        }
        //int answer[] = new int[one.length+two.length];

        ArrayList<Integer> answer  =new ArrayList<>();

        int min = num1 > num2 ? num2 : num1;

        int p1=0;
        int p2=0;

        //end
        while(p1 < num1 && p2 < num2){
            if(one[p1] > two[p2]){
                /*
                answer.add(two[p2]);
                p2++;
                */
                answer.add(two[p2++]);
            }else{
                answer.add(one[p1]);
                p1++;
            }
        }
        while(p1<num1){
            answer.add(one[p1++]);
        }
        while(p2<num2){
            answer.add(two[p2++]);
        }
        for(int i=0;i<answer.size();i++){
            System.out.print(answer.get(i)+" ");
        }
    }
}
