import axios from "axios";

export class Api {
  static axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL
  });
  static get = this.axios.get;
  static post = this.axios.post;
  static put = this.axios.put;
  static delete = this.axios.delete;

  /*static setAuth(token: string) {
    console.log(token);
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };*/
};