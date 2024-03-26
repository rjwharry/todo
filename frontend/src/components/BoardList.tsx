import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodoState, Status, status, todoState, traverse } from "../atom/todo";
import Board from "./Board";
import { useRecoilState } from "recoil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITodo, getTodos, updateTodo } from "../api/todo";
import { useEffect } from "react";

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
  const queryClient = useQueryClient();
  const [todos, setTodos] = useRecoilState(todoState);
  const { data, isLoading } = useQuery<ITodo[]>({
    queryKey: ["todos", "all"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "all"] });
    },
  });

  const onDragEnd = (info: DropResult) => {
    const { source, destination } = info;
    if (!destination) return;
    const sourceTodos = [...todos[source.droppableId]];
    const targetTodos =
      source.droppableId === destination.droppableId
        ? sourceTodos
        : [...todos[destination.droppableId]];
    const todo = {
      ...sourceTodos[source.index],
      status: destination.droppableId as Status,
    };
    sourceTodos.splice(source.index, 1);
    targetTodos.splice(destination.index, 0, todo);
    const newTodos = {
      ...todos,
      [source.droppableId]: sourceTodos,
      [destination.droppableId]: targetTodos,
    };
    mutation.mutate({
      todo: todo,
      prev: targetTodos[destination.index - 1]?.id,
      next: targetTodos[destination.index + 1]?.id,
    });
    setTodos(newTodos);
  };

  useEffect(() => {
    if (data && !isLoading) {
      const newTodos: ITodoState = {
        TODO: traverse(data?.filter((todo) => todo.status === "TODO")) ?? [],
        DOING: traverse(data?.filter((todo) => todo.status === "DOING")) ?? [],
        DONE: traverse(data?.filter((todo) => todo.status === "DONE")) ?? [],
      };
      setTodos(newTodos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

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
