import axios from "axios";
import { Status } from "../atom/todo";
import { BASE_PATH } from "./constants";

export interface ITodo {
  id: number | null;
  name: string;
  contents: string | null;
  status: Status;
  prev: number | null;
  next: number | null;
  createdAt: Date | null;
}

export interface IUpdateTodo {
  todo: ITodo;
  prev: number | null;
  next: number | null;
}

const TODO_BASE_PATH = `${BASE_PATH}/todos`;

export function getTodos() {
  return axios
    .get(TODO_BASE_PATH)
    .then((res) => {
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
