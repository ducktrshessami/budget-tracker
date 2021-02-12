const transactionName = "offline";

let db;
let connection = indexedDB.open("localTransactions");

function saveRecord(record) {
    db.transaction(transactionName, "readwrite")
        .objectStore(transactionName)
        .add(record);
}

function checkDb() {
    db.transaction(transactionName, "readwrite")
        .objectStore(transactionName)
        .getAll()
        .onsuccess = function () {
            fetch("/api/transaction/bulk", {
                method: "post",
                body: JSON.stringify(this.result),
                headers: { "Content-Type": "application/json" }
            })
                .then(clearDb);
        };

}

function clearDb() {
    db.transaction(transactionName, "readwrite")
        .objectStore(transactionName)
        .clear();
}

connection.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.createObjectStore(transactionName, { autoIncrement: true });
};

connection.onsuccess = function (event) {
    db = event.target.result;
    checkDb();
};

window.addEventListener("online", checkDb);
