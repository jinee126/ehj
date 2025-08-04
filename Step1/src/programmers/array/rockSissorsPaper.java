package programmers.array;

import java.util.Scanner;

public class rockSissorsPaper {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        int game = sc.nextInt();
        sc.nextLine();

        String aGaame[] = sc.nextLine().split(" ");
        String bGaame[] = sc.nextLine().split(" ");

        StringBuilder answer = new StringBuilder();

        //가위, 바위, 보의 정보는 1:가위, 2:바위, 3:보
        for(int i=0; i<game;i++){
           if((aGaame[i].equals("1") && bGaame[i].equals("2"))
           || (aGaame[i].equals("2") && bGaame[i].equals("3"))
                   || (aGaame[i].equals("3")  && bGaame[i].equals("1"))){
               answer.append("B").append("\n");
           }else if((aGaame[i].equals("1") && bGaame[i].equals("3"))
           || (aGaame[i].equals("3")  && bGaame[i].equals("2"))
                   || (aGaame[i].equals("2")  && bGaame[i].equals("1"))){
               answer.append("A").append("\n");
           }else{
               answer.append("D").append("\n");
           }
        }
        System.out.println(answer.toString());

    }
}
