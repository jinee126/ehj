package programmers.hash;

import java.util.HashMap;
import java.util.Scanner;

public class classLeader {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        String str = sc.nextLine();

        HashMap<String, Integer> map = new HashMap<String, Integer>();
        for(int i = 0; i < n; i++){
           if(!map.containsKey(String.valueOf(str.charAt(i)))){
               map.put(String.valueOf(str.charAt(i)), 1);
           }else{
               map.put(String.valueOf(str.charAt(i)),map.get(String.valueOf(str.charAt(i))) + 1);
           }
        }

        int max = 0;
        String key  ="";
        for(String str2: map.keySet()){
            if(map.get(str2)>max){
                max = map.get(str2);
                key = str2;
            }
        }
        /*
        HashMap.Entry<String, Integer> maxEntry = map.entrySet()
                .stream()
                .max(HashMap.Entry.comparingByValue())
                        .get();
        */
        System.out.println(key);
    }

}
