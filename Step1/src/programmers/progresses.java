package programmers;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

//기능개발 (스택/큐-레벨2)
public class progresses{
	
	
	public static int[] solution(int[] progresses, int[] speeds) {
		int[] answer = {};
		
		Queue<Integer> lefts = new LinkedList<Integer>();
		for(int i=0; i<progresses.length;i++) {
			//남은 진도율
			int left = 100-progresses[i];
			
			int aa = left % speeds[i];
			int bb = left / speeds[i];
			if(aa>0) {
				bb++;
			}
			lefts.offer(bb);
		} 
		
		
		int commitCnt = 1;
		for(int x : lefts) {
			int key = lefts.poll();
			
			
		}
		
		return answer;
	}
	
	public static void main(String args[] ){
		int[] progresses= {93,30,55};
		int[] speeds = {1,30,5};
		solution(progresses,speeds);
	}

}