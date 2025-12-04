import { api, LightningElement } from 'lwc';

export default class AbandonLoanReviewButton extends LightningElement {

    @api recordId;
    caseId;
    showConfirmDialog = false;



    openconfirmationdialogBox() {
        this.showConfirmDialog = true;
    }

    handleConfirmDialogNo() {
        this.showConfirmDialog = false;
    }

    handleConfirmDialogYes() {
        this.caseId = this.recordId;

        this.template.querySelector('lightning-flow').startFlow('AlertMessageofLoanReview', this.flowInputVariables);
        this.showConfirmDialog = false;
    }

    get flowInputVariables() {

        return [
            {
                name: "var_CaseId",
                type: "String",
                value: this.recordId,
            },
        ];
    }
}
