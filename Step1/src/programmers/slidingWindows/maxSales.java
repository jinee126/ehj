package programmers.slidingWindows;

import java.util.Scanner;

//초기값을 구하고 앞에더하고 뒤에빼는형식
//창문이 가는것처럼..
public class maxSales {
    public static void main(String[] args){
        Scanner sc  = new Scanner(System.in);
        int num = sc.nextInt();
        int cnt = sc.nextInt();

        int numbers[] = new int[num];
        for(int i=0; i<num; i++){
            numbers[i] = sc.nextInt();
        }

        //로직
        int max =0;
        int total =0;
        int p=0;
        /*
        while(p<num-cnt){
            if(p==0){
                for(int i=0; i<cnt; i++){
                    total += numbers[p+i];
                }
                max = total;
            }else{
                total = total+numbers[p+cnt-1]-numbers[p-1];
            }
            p++;
            if(max<total){
                max = total;
            }
        }
        */
        //초기값을 구한다
        for(int i=0; i<cnt; i++){
            total+=numbers[i];
        }
        max=total;
        for(int i=cnt; i<num; i++){
            total += numbers[i]-numbers[i-cnt];
            if(max<total){
                max = total;
            }
        }


        System.out.println(max);


    }
}
