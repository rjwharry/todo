import { atom, selectorFamily } from "recoil";

export const status = {
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type Status = (typeof status)[keyof typeof status];

export interface ITodo {
  id: number;
  name: string;
  contents: string;
  status: Status;
  createdAt: Date;
}

export const todoState = atom<ITodo[]>({
  key: "todo",
  default: [
    {
      id: 1,
      name: "test",
      contents: "This is test todo",
      status: "TODO",
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "test2",
      contents: "This is test2 todo",
      status: "TODO",
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "test3",
      contents: "This is test3 todo",
      status: "DOING",
      createdAt: new Date(),
    },
    {
      id: 4,
      name: "test4",
      contents: "This is test4 todo",
      status: "DONE",
      createdAt: new Date(),
    },
  ],
});

export const todoSelector = selectorFamily({
  key: "todoSelector",
  get:
    (params: number) =>
    ({ get }) => {
      const todos = get(todoState);
      return todos.filter((todo) => todo.id === params);
    },
});

export const todoStatusSelector = selectorFamily({
  key: "todoStatusSelector",
  get:
    (params: Status) =>
    ({ get }) => {
      const todos = get(todoState);
      return filterTodoWithStatus(todos, params);
    },
});

const filterTodoWithStatus = (todos: ITodo[], status: Status): ITodo[] => {
  return todos.filter((todo) => todo.status === status);
};
