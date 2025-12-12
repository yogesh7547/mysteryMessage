import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbconnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;

        console.log("Connected to database successfully");

    } catch (error) {
        console.log("Database connection failed")
        process.exit(1);
    }
}

export default dbconnect;

//process.exit(1) : It forces your entire application to shut down immediately. The script stops running, the server stops listening, and the program ends right there.

//The Logic: Your web app cannot function without a database. There is no point in keeping the server running if it can't save or fetch data. So, instead of letting the app limp along in a broken state, process.exit(1) tells the server: "I have a critical failure. Kill me now so I can restart (or alert the developer)."