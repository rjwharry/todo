import { atom, selectorFamily } from "recoil";
import { ITodo } from "../api/todo";

export const status = {
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type Status = (typeof status)[keyof typeof status];

export interface ITodoState {
  [key: string]: ITodo[];
}

export interface ITodoSelectorParams {
  type: Status;
  id: number;
}

export const todoState = atom<ITodoState>({
  key: "todo",
  default: {
    TODO: [],
    DOING: [],
    DONE: [],
  },
});

const findById = (todos: ITodo[], id: number): ITodo | undefined => {
  return todos.find((todo) => todo.id === id);
};

export const traverse = (todos: ITodo[]): ITodo[] => {
  const linkedTodos: ITodo[] = [];
  let fisrtTodo = todos.find((todo) => todo.prev === null);
  if (fisrtTodo === undefined) return [];
  linkedTodos.push(fisrtTodo);
  let nextTodo = fisrtTodo.next ? findById(todos, fisrtTodo.next) : undefined;
  while (nextTodo !== undefined) {
    linkedTodos.push(nextTodo);
    nextTodo = nextTodo.next ? findById(todos, nextTodo.next) : undefined;
  }
  return linkedTodos;
};

export const todoStatusSelector = selectorFamily({
  key: "todoStatusSelector",
  get:
    (params: Status) =>
    ({ get }) => {
      const todos = get(todoState);
      return todos[params];
    },
});

export const todoSelector = selectorFamily({
  key: "todoSelector",
  get:
    (id: number) =>
    ({ get }) => {
      const todos = get(todoState);
      return Object.values(todos)
        .reduce((a, b) => [...a, ...b])
        .find((todo) => todo.id === id);
    },
});
