package programmers.hash;

import java.util.Scanner;
import java.util.HashMap;

public class anagram {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String str1 = sc.nextLine();
        String str2 = sc.nextLine();

        HashMap<String,Integer> str1Map = new HashMap<>();
        HashMap<String,Integer> str2Map = new HashMap<>();
        for(int i=0; i<str1.length();i++){
            /*
            if(str1Map.containsKey(String.valueOf(str1.charAt(i)))){
                str1Map.put(String.valueOf(str1.charAt(i)),str1Map.get(String.valueOf(str1.charAt(i)))+1);
            }else{
                str1Map.put(String.valueOf(str1.charAt(i)),1);
            }*/
            str1Map.put(String.valueOf(str1.charAt(i)),str1Map.getOrDefault(String.valueOf(str1.charAt(i)),0)+1);
        }

        for(int i=0; i<str2.length();i++){
            if(str2Map.containsKey(String.valueOf(str2.charAt(i)))){
                str2Map.put(String.valueOf(str2.charAt(i)),str2Map.get(String.valueOf(str2.charAt(i)))+1);
            }else{
                str2Map.put(String.valueOf(str2.charAt(i)),1);
            }
        }

        String result = "YES";
        for(String str:str1Map.keySet()){
            if(!str1Map.get(str).equals(str2Map.get(str))){
                result = "NO";
            }
        }
        System.out.println(result);
    }
}
