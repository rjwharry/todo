import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodo, Status, status, todoState } from "../atom/todo";
import Board from "./Board";
import { useRecoilState, useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  border: 3px solid;
  border-radius: 5px;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: auto;
`;

function BoardList() {
  const setTodos = useSetRecoilState(todoState);
  const onDragEnd = (info: DropResult) => {
    setTodos((old) => {
      const { draggableId, destination } = info;
      const idx = old.findIndex((todo) => todo.id === +draggableId);
      const newTodo = {
        ...old[idx],
        status: destination?.droppableId as Status,
      };
      const newTodos = replaceItemAtIndex(old, idx, newTodo);
      return newTodos;
    });
  };

  const replaceItemAtIndex = (
    todos: ITodo[],
    index: number,
    newTodo: ITodo
  ) => {
    return [...todos.slice(0, index), newTodo, ...todos.slice(index + 1)];
  };

  const removeItemAtIndex = (todos: ITodo[], index: number) => {
    return [...todos.slice(0, index), ...todos.slice(index + 1)];
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.values(status).map((boardType, idx) => (
            <Board key={boardType} boardType={boardType} idx={idx} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default BoardList;
