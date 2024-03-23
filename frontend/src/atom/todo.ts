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
    // TODO: [
    //   {
    //     id: 1,
    //     name: "test",
    //     contents: "This is test todo",
    //     status: "TODO",
    //     createdAt: new Date(),
    //   },
    //   {
    //     id: 2,
    //     name: "test2",
    //     contents: "This is test2 todo",
    //     status: "TODO",
    //     createdAt: new Date(),
    //   },
    // ],
    // DOING: [
    //   {
    //     id: 3,
    //     name: "test3",
    //     contents: "This is test3 todo",
    //     status: "DOING",
    //     createdAt: new Date(),
    //   },
    // ],
    // DONE: [
    //   {
    //     id: 4,
    //     name: "test4",
    //     contents: "This is test4 todo",
    //     status: "DONE",
    //     createdAt: new Date(),
    //   },
    // ],
  },
});

// export const todoSelector = selectorFamily({
//   key: "todoSelector",
//   get:
//     (params: ITodoSelectorParams) =>
//     ({ get }) => {
//       const todos = get(todoState);
//       return todos[params.type].find((todo) => todo.id === params.id);
//     },
// });

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
