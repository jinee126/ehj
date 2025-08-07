package programmers.array;

import java.util.Scanner;

public class rank {
    public static void main(String args[]){
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();
        int score[] = new int[num];
        for(int i=0;i<num;i++){
            score[i] = sc.nextInt();
        }

        int answer[] = new int[num];
        for(int i=0; i<num;i++){
            int cnt = 1;
            for(int j=0;j<num;j++){
                if(score[i]<score[j]){
                    cnt++;
                }
            }
            answer[i] = cnt;
        }
        for(int i=0;i<num;i++){
         System.out.print(answer[i]+" ");
        }


    }
}
