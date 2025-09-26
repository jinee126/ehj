package programmers.level2;

import java.util.Arrays;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.Scanner;
import java.util.stream.Stream;

public class minMax {

    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();


        int n[] = Arrays.stream(s.split(" "))
                .mapToInt(Integer::parseInt)
                .toArray();

        int min =  n[0], max = n[0];
        for(int i=0; i<n.length; i++){
            if(min>n[i]){
                min=n[i];
            }
            if(max<n[i]){
                max=n[i];
            }
        }
        String answer = min+" "+max;
        System.out.println(min+" "+max);

       /* int min = Arrays.stream(s.split(" "))
                .mapToInt(Integer::parseInt)
                .min().getAsInt();*/


    }
}
