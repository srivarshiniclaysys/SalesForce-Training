({
    invoke : function(component, event, helper) {
        let listViewId = component.get("v.listViewId");
        let navEvent = $A.get("e.force:navigateToList");
        navEvent.setParams({
            "listViewId": listViewId,
            "listViewName": 'All',
            "scope": "Case"
        });
        navEvent.fire();    
    }
})