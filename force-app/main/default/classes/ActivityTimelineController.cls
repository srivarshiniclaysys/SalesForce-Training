/**
*  Class that retrieves tasks and update task status.
*/
public with sharing class ActivityTimelineController {
    
    /** Retrieves all task associated to the loan review.
    *
    * @param caseId The string contains the loan review ID.
    * @return A list of tasks associated with the loan review.
    */
    @AuraEnabled(cacheable=true)
    public static List<Task> getActivities(String caseId) {
        List<Task> tasks = new List<Task>();
        
        try {
            tasks = [
                SELECT 
                    Id, 
                    Subject,
                	Status,
                    ActivityDate, 
                    Description, 
                    Owner.Name, 
                    What.Name 
                FROM 
                    Task 
                WHERE 
                    WhatId = :caseId 
                AND 
                    Status <> 'Completed'
                ORDER BY 
                    Checklist_Order_Number__c
            ];
        } catch(Exception e) {
            System.debug('Error in getActivities method: ' + e.getMessage());
        }
        return tasks;
    }

    /**
    * Retrieves all completed task associated to the loan review.
    *
    * @param caseId The string contains the loan review Id.
    */
    @AuraEnabled(cacheable=true)
    public static List<Task> getCompletedTasks(String caseId) {
        List<Task> tasks = new List<Task>();
        
        try {
            tasks = [
                SELECT 
                    Id, 
                    Subject, 
                    ActivityDate, 
                    Description, 
                    Owner.Name, 
                    What.Name 
                FROM 
                    Task 
                WHERE 
                    WhatId = :caseId 
                AND 
                    Status = 'Completed'
                ORDER BY 
                    Checklist_Order_Number__c
            ];
        } catch(Exception e) {
            System.debug('Error in getCompletedTasks method: ' + e.getMessage());
        }
        
        return tasks;
    }

    /**
    * Update task status to complete.
    *
    * @param taskId The String contains Task Id.
    */
    @AuraEnabled
    public static void completeTask(String taskId) {
        try {
            Task tasks = [
                SELECT 
                    Id 
                FROM 
                    Task 
                WHERE 
                    Id = :taskId
            ];
            if(tasks != null) {
                tasks.Status = 'Completed';
                update tasks;
            }
        } catch(Exception e) {
            System.debug('Error in completeTask method: ' + e.getMessage());
        }
    }

    /**
    * Update all tasks status as complete.
    *
    * @param recordId The String store loan review Id
    */
    @AuraEnabled
    public static void completeAllTasks(String recordId) {
        List<Task> tasks = new List<Task>();
        
        try {
            tasks = [
                SELECT 
                    Id, 
                    Status 
                FROM 
                    Task 
                WHERE 
                    WhatId = :recordId 
                AND 
                    Status <> 'Completed'
            ];
            
            for(Task task : tasks) {
                task.Status = 'Completed';
            }
            
            update tasks;
        } catch(Exception e) {
            System.debug('Error in completeAllTasks method: ' + e.getMessage());
        }
    }
}