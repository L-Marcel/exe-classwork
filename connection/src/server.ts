import { http, io } from ".";

const port = process.env.PORT || 3333;

io.listen(http.listen(port, () => {
 console.log("Sever is running in: ", port); 
}));