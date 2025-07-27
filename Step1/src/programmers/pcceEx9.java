package programmers;


import java.util.Scanner;

//pcce- 기출문제 9
//
 //문제풀이방법
//해당위치의 상하좌우가 같은 색깔인지 판단

public class pcceEx9 {
    public static void main(String[] args) {
        String[][] board = new String[][]{{"yellow", "green", "blue"}, {"blue", "green", "yellow"}, {"yellow", "blue", "blue"}};

        Scanner sc = new Scanner(System.in);
        int h  = sc.nextInt();
        int w = sc.nextInt();


        int answer = solution(board,h,w);
        System.out.println(answer);
    }

    public static int solution(String[][] board, int h, int w) {
        int answer = 0;

        String standard = board[h][w];

        //상
        if(w>0 && standard.equals(board[h][w-1])){
            answer++;
        }
        if(h>0 && standard.equals(board[h-1][w])){
            answer++;
        }
        if(h+1<board.length && standard.equals(board[h+1][w])){
            answer++;
        }
        if(w+1<board[0].length &&standard.equals(board[h][w+1])){
            answer++;
        }

        return answer;
    }
}
