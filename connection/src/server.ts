import { http, io } from ".";

io.listen(http.listen(process.env.PORT || 3333));