package programmers.array;

import java.util.ArrayList;
import java.util.Scanner;

//성능은 ArrayList 쓰는게 더 좋앗다
//하나씩 for를 돌리는게 빠르다..(가로, 세로, 대각선1, 대각선2)
public class maxPlus {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cnt = sc.nextInt();
        int grid[][] = new int[cnt][cnt];

        for(int i=0; i<cnt; i++){
            for(int j=0; j<cnt; j++){
                grid[i][j] = sc.nextInt();
            }
        }

        int max = 0;
        ArrayList<Integer> tot = new ArrayList<Integer>();
        int sum1 = 0;
        int sum2 = 0;
        for(int i=0; i<cnt; i++){
            sum1 = 0;
            sum2  = 0;
            for(int j=0; j<cnt; j++){
                sum1 += grid[i][j];
                sum2 += grid[j][i];
            }
            tot.add(sum1);
            tot.add(sum2);
            //max = Math.max(max,sum1);
          //  max = Math.max(max,sum2);
        }

        sum1 = 0;
        sum2 = 0;
        for(int i=0; i<cnt; i++){
            sum1 += grid[i][i];
            sum2 += grid[i][cnt-i-1];
        }
        tot.add(sum1);
        tot.add(sum2);

        for(int i=0; i<tot.size(); i++){
            if(max<tot.get(i)){
                max = tot.get(i);
            }
        }

        System.out.println(max);

    }

}
