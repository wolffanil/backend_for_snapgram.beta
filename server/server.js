const mongoose = require("mongoose");
const app = require("./index");

mongoose.set("strictQuery", true);

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL);

      console.log("Успешное подключение к базе данных!");
    } else {
      console.log("Подключение к базе данных уже установлено.");
    }
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error.message);
  }
};

connectToDatabase();

const port = process.env.PORT || 4444;

app.listen(port, () => {
  console.log(`Server working on port ${port}`);
});
