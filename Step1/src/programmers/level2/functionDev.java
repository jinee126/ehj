package programmers.level2;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class functionDev {
    public static void main(String[] args) {
        int[] progresses = {93, 30, 55};
        int[] speeds = {1, 30, 5};

        int[] answer = solution(progresses,speeds);



    }
    public static int[] solution(int[] progresses, int[] speeds) {
        /*
        int[] answer = {};

        ArrayList anwer2 = new ArrayList<>();
        Queue<Integer> q = new LinkedList<>();
        for(int i=0; i<progresses.length;i++){
            int day = (100-progresses[i])/speeds[i];
            if(!((100-progresses[i])%speeds[i]==0)) day++;
            q.add(day);
        }
        int cnt =1;
        int basic = q.poll();
        while(!(q.isEmpty())){
            int tmp = q.poll();
            if(tmp<=basic) {
                cnt++;
            }else{
                basic = tmp;
                anwer2.add(cnt);
                cnt = 1;
            }
        }
        anwer2.add(cnt);
        answer = anwer2.stream().mapToInt(i->(int)i).toArray();

        return answer;
*/
        Queue<Integer> q = new LinkedList<>();
        List<Integer> answerList = new ArrayList<>();
        for (int i = 0; i < speeds.length; i++) {
            double remain = (100 - progresses[i]) / (double) speeds[i];
            int date = (int) Math.ceil(remain);

            System.out.println(q.peek());
            System.out.println(date);

            if (!q.isEmpty() && q.peek() < date) {

                answerList.add(q.size());
                q.clear();
            }

            q.offer(date);
        }

        answerList.add(q.size());

        int[] answer = new int[answerList.size()];

        for (int i = 0; i < answer.length; i++) {
            answer[i] = answerList.get(i);
        }

        return answer;
    }
}
