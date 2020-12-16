public with sharing class ContactDelitionController {
    @AuraEnabled
    public static Integer totalRecords(){
        return [SELECT COUNT() FROM Contact];
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Integer vOffset, Integer vPagesize){
        return [SELECT FirstName, LastName, Email, Title FROM Contact ORDER BY FirstName LIMIT :vPagesize OFFSET :vOffset];
    }
    @AuraEnabled(cacheable=true)
    public static Integer getNext(Integer vOffset, Integer vPagesize){
        vOffset += vPagesize;
        return vOffset;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getPrevious(Integer vOffset, Integer vPagesize){
        vOffset -= vPagesize;
        return vOffset;
    }
    @AuraEnabled
    public static void contactDelition( List<Contact> contactsList ) {
        List<Id> ids = new List<Id>();
        for(Contact c : contactsList){
            ids.add(c.id);
        }
        List<Case> related_cases = [ SELECT Id FROM Case WHERE ContactId IN :ids  ];
        for(Case c : related_cases){
            c.ContactId = null;
        }
        delete contactsList;
    }
}
