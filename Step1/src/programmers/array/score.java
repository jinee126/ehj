package programmers.array;

import java.util.Scanner;

public class score {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tot = sc.nextInt();
        sc.nextLine();
        int score[] = new int[tot];
        for(int i=0; i<tot;i++){
            score[i] = sc.nextInt();
        }

        int cnt =0;
        int answer =0;

        for(int j=0; j<tot;j++){
            if(score[j] == 1 ){
                cnt++;
                answer+=cnt;
            }else{
                cnt =0;
            }

        }

        System.out.println(answer);

    }
}
