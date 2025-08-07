package programmers.array;

import javax.xml.transform.stream.StreamSource;
import java.util.Scanner;

//이차원 배열에서 방향성이 나오는 경우 방향을 체크하는 기준배열을 만든다
public class peaks {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        int mount[][] =  new int[n][n];
        for(int i=0; i<n; i++){
            for(int j=0; j<n; j++){
                mount[i][j] = sc.nextInt();
            }
        }


        //시계방향
        int[] x = {-1,0,1,0};
        int[] y = {0,-1,0,1};
 
        int tot =0;
        for(int i=0; i<n; i++){
            for(int j=0; j<n; j++){
                int a = mount[i][j];

                boolean result =true;
                    for(int t=0; t<4; t++){
                        int dx = x[t]+j;
                        int dy = y[t]+i;
                        if (dx >= 0 && dy>= 0 && dx< n && dy< n){
                            if(a <= mount[dy][dx]){
                                result = false;
                           }
                        }
                    }
                if(result){
                    tot++;
                }

            }
        }

        System.out.println(tot);


    }
}
