package programmers.array;

import java.util.Scanner;

//소수구하기
//에라토스테네스의 체
public class decimal {
    public static void main(String[] args){

        Scanner sc  = new Scanner(System.in);
        int num  = sc.nextInt();

        int array[]  = new int[num+1];


        for(int i=2;i<=array.length;i++){
            for(int j=2;j*i<=num;j++){
                array[i*j] += 1;
            }
        }

        int ans = 0;
        for(int t=2;t<array.length;t++){
            if(array[t] == 0 ){

                ans++;
            }
        }
     System.out.println(ans);

    }
}
