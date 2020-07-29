import { LightningElement, wire } from 'lwc';

export default class DataTableDemoChild extends LightningElement {
    columns = [
        { label: 'Creditor', fieldName: 'creditorName', type: 'text' },
        { label: 'FirstName', fieldName: 'firstName', type: 'text' },
        { label: 'LastName', fieldName: 'lastName', type: 'text' },
        { label: 'MinPay%', fieldName: 'minPaymentPercentage', type: 'number' },
        { label: 'Balance', fieldName: 'balance', type: 'number' },
    ];
    data = [];
    selectedRows = [];
    selectedCount = 0;
    selectedRecBalance = 0;
    totalRecCount = 0;
    totalRecBalance = 0;
    
    async connectedCallback(){
    const data = await fetch('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json', {
        method: "GET",
        headers: {
            "Accept": "application/json"
          }
    }).then(
        (response) => {
            if (response.ok) {
              return response.json();
            } 
        }
    );
    this.data = data;
    this.totalRecCount = data.length;
    for (let i = 0; i < data.length; i++) {
      this.totalRecBalance += data[i].balance;
  }
}
    countData(dataValue) {
        this.totalRecCount = dataValue.length;
        this.totalRecBalance = 0;
        for (let i = 0; i < dataValue.length; i++) {
            this.totalRecBalance += dataValue[i].balance;
        }
    }

    showModal;
    tempRow = {};

    handleSelectAction(event) {
        const selRows = event.detail.selectedRows;
        this.selectedRows = selRows;
        this.selectedCount = this.selectedRows.length;
        let selbalance = 0;
        for (let i = 0; i < this.selectedRows.length; i++) {
            selbalance += this.selectedRows[i].balance;
        }
        this.selectedRecBalance = selbalance;
    }
   
    handleAdd() {
        this.tempRow = {};
        this.showModal = true;
    }

    handleSave() {
        const allValid = [...this.template.querySelectorAll(`lightning-input`)]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (!allValid) {
            return;
        }
        let newData = JSON.parse(JSON.stringify(this.data));
        newData.push(this.tempRow);
        this.data = newData;
        this.countData(this.data);
        this.tempRow = {};
        this.showModal = false;
    }
    handleInputChange(event) {
        let eventValue = event.target.value;
        this.tempRow[event.target.name] = eventValue;
        if (event.target.name === 'minPaymentPercentage' || event.target.name === 'balance') {
            this.tempRow[event.target.name] = parseInt(eventValue);
        }
    }

    handleCancel() {
        this.tempRow = {};
        this.showModal = false;
        this.editindex = undefined;
    }

    handleRemove(event) {
        let newData = JSON.parse(JSON.stringify(this.data));
        for (let i = 0; i < this.selectedRows.length; i++) {
            newData.splice(newData.findIndex(data => data.id === this.selectedRows[i].id),1);
            this.data = newData;
            this.countData(this.data);
        }
    }
}
