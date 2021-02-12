let db;
let connection = indexedDB.open("localTransactions");

function saveRecord(transaction) {
    
}

function checkDb() {

}

connection.onsuccess = function(event) {
    db = event.target.result;
    checkDb();
};
