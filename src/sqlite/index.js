import SQLite from "react-native-sqlite-storage-api30";


const tableName = 'items';

const dbConn = SQLite.openDatabase({
    name: 'kasirex',
},(r) => {
}, (err) => {
  console.log(err)
})


export default dbConn
