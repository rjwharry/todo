import axios from "axios";
import { Status } from "../atom/todo";
import { BASE_PATH } from "./constants";

export interface ITodo {
  id: number;
  name: string;
  contents: string | undefined;
  status: Status;
  prev: number | undefined;
  next: number | undefined;
  createdAt: Date;
}

export interface IUpdateTodo {
  todo: ITodo;
  prev: number | undefined;
  next: number | undefined;
}

const TODO_BASE_PATH = `${BASE_PATH}/todos`;

export function getTodos() {
  return axios
    .get(TODO_BASE_PATH)
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => console.log(err));
}

export function getTodo(id: number) {
  return axios.get(`${TODO_BASE_PATH}/${id}`).then((res) => res.data);
}

export function createTodo(todo: ITodo) {
  return axios.post(TODO_BASE_PATH, todo).then((res) => res.data);
}

export function updateTodo(payload: IUpdateTodo) {
  return axios
    .put(`${TODO_BASE_PATH}/${payload.todo.id}`, payload)
    .then((res) => res.data);
}

export function deleteTodo(id: number) {
  return axios.delete(`${TODO_BASE_PATH}/${id}`).then((res) => res.data);
}
