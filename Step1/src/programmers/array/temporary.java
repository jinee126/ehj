package programmers.array;


import java.util.Scanner;

//같은 학생
public class temporary {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int stu[][] = new int[n][5];

        for(int j=0;j<n;j++){
            for(int i=0;i<5;i++){
                stu[j][i]=sc.nextInt();
            }
        }
        //**************************
        int answer[] = new int[n];

        //기준값
        //int standard =0;
        for(int x=0; x<n;x++){
            int cnt =0;
            for(int y=0;y<n;y++){ //옆으로 돌면서 j번째
                for(int k=0; k<5;k++){  // 학년
                    if(stu[x][k]==stu[y][k]){
                        cnt++;
                        break;//한번만 카운팅하기위해!!
                    }
                }
            }
            answer[x]=cnt;
        }
        //최대값
        int max =0;
        int answerStu=0;
        for(int i=0;i<n;i++){
            if(answer[i]>max){
                max=answer[i];
                answerStu = i+1;
            }
        }
        System.out.println(answerStu);
    }

}
