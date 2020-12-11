public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        List<Contact> contacts =  [SELECT FirstName, LastName, Email, Title FROM Contact ORDER BY FirstName];
        return contacts;
    }
    @AuraEnabled
    public static void contactDelition( List<Id> ids ) {
        Delete [ Select Id FROM Case WHERE ContactId in :ids  ];
        Delete [Select Id FROM CONTACT WHERE Id in :ids ];
    }
}
