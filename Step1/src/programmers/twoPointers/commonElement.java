package programmers.twoPointers;

import java.util.ArrayList;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

//배열 정렬떄는 Arrays.sort
//ArrayList 일떄는 Collection.sort

public class commonElement {
    public static void main(String[] args) {
        Scanner sc   = new Scanner(System.in);
        int n = sc.nextInt();
        int num1[] = new int[n];
        for(int i=0; i<n; i++){
            num1[i] = sc.nextInt();
        }
        int n2 = sc.nextInt();
        int num2[]  = new int[n2];
        for(int j =0; j<n2; j++){
            num2[j] = sc.nextInt();
        }

        //정렬 먼저
        Arrays.sort(num1);
        Arrays.sort(num2);
        //로직
        int p1=0;
        int p2=0;
        ArrayList<Integer> ans = new ArrayList<Integer>();
        while(p1<n && p2<n2){
            if(num1[p1] == num2[p2]){
                ans.add(num1[p1++]);
                p2++;
            }else if(num1[p1] < num2[p2]){
                p1++;
            }else{
                p2++;
            }
        }
        ans.forEach(e -> System.out.print(e + " "));

    }
}
