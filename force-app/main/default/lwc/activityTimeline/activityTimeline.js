import { LightningElement, wire, api } from 'lwc';
import getActivities from '@salesforce/apex/ActivityTimelineController.getActivities';
import completeTask from '@salesforce/apex/ActivityTimelineController.completeTask';
import completedTasksLists from '@salesforce/apex/ActivityTimelineController.getCompletedTasks';
import completeAllTasks from '@salesforce/apex/ActivityTimelineController.completeAllTasks';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
export default class ActivityTimeline extends NavigationMixin(LightningElement) {

    @api recordId;
    @wire(getActivities, {
        caseId: '$recordId'
    })
    activities;
    noActivitiesMessage = 'No activities to show.';

    get hasActivities() {
        return this.activities && this.activities.data && this.activities.data.length > 0;
    }

    get showNoActivitiesMessage() {
        return !this.hasActivities;
    }
    @wire(completedTasksLists, {
        caseId: '$recordId'
    })
    completedTasks;

    get hasCompletedTasks() {
        return this.completedTasks && this.completedTasks.data && this.completedTasks.data.length > 0;
    }

    refreshUpcoming() {
        return refreshApex(this.activities);
    }
    refreshCompleted() {
        return refreshApex(this.completedTasks);
    }
    refreshTimeline() {
        this.refreshUpcoming();
        this.refreshCompleted();
    }


    showTask(event) {
        const recordId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Task',
                actionName: 'view'
            }
        });
    }

    handleCheckboxClick(event) {
        const taskId = event.target.value;
        const isChecked = event.target.checked;
        const labelElement = this.template.querySelector('p[data-id="' + taskId + '"]');

        if (isChecked) {
            completeTask({
                taskId
            })
                .then(() => {
                    labelElement.classList.add("strikethrough");
                })
                .catch(error => {
                    console.error('Error updating task:', error);
                });
        } else {
            labelElement.classList.remove("strikethrough");
        }
    }

    completeAllTasks() {
        completeAllTasks({
            recordId: this.recordId
        })
            .then(result => {
                this.refreshUpcoming();
                this.refreshCompleted();
            })
            .catch(error => {
                console.error(error);
            });
    }
    handleArrowClick(event) {
        const arrowIcon = event.target;
        const arrowDirection = arrowIcon.dataset.arrowDirection;
        const parentLi = arrowIcon.closest('li');
        const descriptionBox = parentLi.querySelector('.box');
        if (arrowDirection === "right") {
            arrowIcon.iconName = "utility:down";
            arrowIcon.dataset.arrowDirection = "down";
            descriptionBox.style.display = 'block';
        } else {
            arrowIcon.iconName = "utility:right";
            arrowIcon.dataset.arrowDirection = "right";
            descriptionBox.style.display = 'none';
        }
    }

}