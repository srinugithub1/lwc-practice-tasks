/*
* Author :- Srinu
* Descreption :- ToDoListTask - list and delete and insert and spining tool and refresh
* created :- 23/04/2021
* Last updated :- 26/04/2021
* Code Origin :- Ref - SFDC Stop
*/
public with sharing class ToDoListTask {

    /*
    * Author :- Srinu
    * Descreption :- Display list values
    */
   
    @AuraEnabled(cacheable=true)

    public static List<Task> getTask() {
        
        return [SELECT Subject FROM Task WHERE OwnerId =: UserInfo.getUserId()];
    }
    /*
    * Author :- Srinu
    * Descreption :- Insert Single task
    */
    @AuraEnabled
    public static task insertTask(String subject){
        try {
            Task task = new Task (
                Subject = subject,
                OwnerId = UserInfo.getUserId(),
                Status = 'Not Started',
                Priority = 'Normal'
            );
            insert task;
            return task;
            
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return null;
    }
    /*
    * Author :- Srinu
    * Descreption :- Delete single task
    */
    @AuraEnabled
    public static Boolean deleteTask(Id recordId){
        try {
            Database.delete(recordId);
            return true;
            
        } catch (Exception e) {
            System.debug(e.getMessage());
            
        }
        return false;
    }
    
}
