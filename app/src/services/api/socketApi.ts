import axios from "axios";

export class SocketApi {
  static axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SOCKET_DOMAIN
  });
  static get = this.axios.get;
  static post = this.axios.post;
  static put = this.axios.put;
  static delete = this.axios.delete;
};