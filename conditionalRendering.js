import { LightningElement } from 'lwc';

export default class ConditionalRendering extends LightningElement {
    name = 'Richard';
    details = 'Richard is the CEO and founder of Pied  Piper';
    showDetails = false;
    actionButtonLabel = 'ShowDetails';

    toggleDetails(){

        this.showDetails = !this.showDetails;
        this.actionButtonLabel = this.showDetails ? 'Hide Details' : 'Show Details';
        console.log(this.showDetails);
    }
}