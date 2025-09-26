package programmers.level2;


//투포인트기법을 활용한 그리디
//가장 무거운 사람은 반드시 태워야 한다 → 그때 가능한 한 가벼운 사람과 짝지어 태우는 게 최적.
//가장 합리적인걸 반복-> 그리디

import java.util.Arrays;
import java.util.Scanner;

public class lifeboat {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int limit2 = sc.nextInt();

        int ss[] = Arrays.stream(s.split(","))
                        .mapToInt(Integer::parseInt)
                        .toArray();

        int a = solution(ss,limit2);
        System.out.print(a);

    }
    public static  int solution(int[] people, int limit) {
        int answer = 0;
        Arrays.sort(people);
        int start = 0;
        int end=people.length-1;

        while(end > start){
            if(people[start] +  people[end] <= limit){
                System.out.println("1");
                start++;
                end--;
                answer++;
            }else{
                System.out.println("2");

                if(end-start==1 && people[start] +  people[end] > limit){
                    System.out.println("end : "+end);
                    answer++;
                }
                answer++;
                end--;
            }
        }

        return answer;
    }

}
