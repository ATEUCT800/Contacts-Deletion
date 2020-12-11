import { LightningElement, wire , track} from 'lwc';
import TITLE_FIELD from '@salesforce/schema/Contact.Title'
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import DEPARTMENT_FIELD from '@salesforce/schema/Contact.Department';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import contactDelition from '@salesforce/apex/ContactController.contactDelition';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const COLUMNS = [
    { label: 'First Name', fieldName: FIRSTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Last Name', fieldName: LASTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'text' },
    { label: 'Title', fieldName: TITLE_FIELD.fieldApiName, type: 'text' },
    { label: 'Department', fieldName: DEPARTMENT_FIELD.fieldApiName, type: 'text' }
];
export default class ContactDelition extends LightningElement {
    columns = COLUMNS;
    wiredContactResult
    
    @track contacts;
    @wire(getContacts)
    wiredContacts(result) {
        this.wiredContactResult = result;
        this.contacts = result.data;
        
    }
    getSelected(){
        let el = this.template.querySelector('lightning-datatable');
        let selected = el.getSelectedRows();
        return selected
    }
    deleteContacts(){
        console.log("start deleting contacts");
        let ContactsForDelition = this.getSelected();
        let ContactsForDelitionID = [];
        ContactsForDelition.forEach(element => {
            ContactsForDelitionID.push(element.Id);
        });
        contactDelition({
            ids: ContactsForDelitionID
        }).then(result => {
            this.contacts = null;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: result,
                    variant: 'success',
                }),
            );
            return refreshApex(this.wiredContactResult);

        });
        console.log(JSON.parse(JSON.stringify(this.contacts)) );
        console.log("finish deleting contacts");
    }
}
