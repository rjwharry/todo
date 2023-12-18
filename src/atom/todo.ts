import { DefaultValue, atom, selector } from 'recoil';

export interface ITodo {
  id: number;
  text: string;
}

export interface ITodoState {
  [key: string]: ITodo[];
}

export const todoState = atom<ITodoState>({
  key: 'todo',
  default: localStorage.getItem('todo')
    ? JSON.parse(localStorage.getItem('todo') as string)
    : {
        'TO DO': [],
        DOING: [],
        DONE: [],
      },
});

export const todoSelector = selector({
  key: 'todoSelector',
  get: ({ get }) => {
    const todos = get(todoState);
    return Array.from(Object.keys(todos));
  },
  set: ({ get, set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(todoState);
      return;
    }
    const todos = get(todoState);
    const newTodos: ITodoState = {};
    newValue.forEach((boardId) => {
      newTodos[boardId] = todos[boardId];
    });
    set(todoState, newTodos);
  },
});
