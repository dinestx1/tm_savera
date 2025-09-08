const { PORT } = require('./config/appConfig');
const DB = require('./config/db')
const {app} = require('./src/server')


DB
    .connect()
    .then(() => {
        console.log("✅ Database connected");

        // const PORT = process.env.PORT || 3000;
        app.listen(8080, () => {
            console.log(`✅ Server is running at port: ${PORT}`);
        });
        app.on("Error", (error) => {
            console.log(error)
        })
    })
    .catch((err) => {
        console.log("Connection Failed", err);
        process.exit(1);
    });
