package programmers;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

//pcce- 기출문제10
//
 //문제풀이방법
//코드 번호, 제조일, 최대 수량, 현재 수량
//코드 번호(code), 제조일(date), 최대 수량(maximum), 현재 수량(remain)
//data	ext	val_ext	sort_by	result
//[[1, 20300104, 100, 80], [2, 20300804, 847, 37], [3, 20300401, 10, 8]]	"date"	20300501	"remain"	[[3,20300401,10,8],[1,20300104,100,80]]

//현재 내 생각
//데이터를 뽑고
//돌면서 정렬시킨다?
public class pcceEx10 {
    public static void main(String[] args) {
       int[][] data = {{1, 20300104, 100, 80}, {2, 20300804, 847, 37}, {3, 20300401, 10, 8}};

        Scanner sc = new Scanner(System.in);
        String ext = sc.nextLine();
        int valExt = sc.nextInt();
        sc.nextLine();
        String sort = sc.nextLine();

        solution(data,ext,valExt,sort);
    }
    public static int[][] solution(int[][] data, String ext, int val_ext, String sort_by) {
        ArrayList<int[]> list = new ArrayList<>();

        int base = switch (ext){
            case "code" -> 0;
            case "date" -> 1;
            case "maximum" -> 2;
            case "remain" -> 3;
            default -> 0;
        };
        for(int i=0;i<data.length; i++){
            if(data[i][base] < val_ext){
                list.add(data[i]);
            }
        }

        int s = switch(sort_by){
            case "code" -> 0;
            case "date" -> 1;
            case "maximum" -> 2;
            case "remain" -> 3;
            default -> 0;
        };

        list.sort(Comparator.comparingInt(o -> o[s]));
        //Collection.sort(list, new Com)

        int[][] answer = new int[list.size()][];

        for (int i = 0; i < list.size(); i++) {
            answer[i] = list.get(i);
        }
        return answer;
    }
}
