import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodoState, Status, status, todoState } from "../atom/todo";
import Board from "./Board";
import { useRecoilState, useSetRecoilState } from "recoil";
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

  const getTodo = (id: number): ITodo | undefined => {
    return Object.values(todos)
      .reduce((a, b) => [...a, ...b])
      .find((todo) => todo.id === id);
  };

  const getTodoByStatusAndIdx = (idx: number, status: Status): ITodo => {
    return todos[status][idx];
  };

  const mutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "all"] });
    },
  });

  const onDragEnd = (info: DropResult) => {
    const { draggableId, source, destination } = info;
    console.log(draggableId, source, destination);
    const todo = getTodo(+draggableId);
    if (!todo || !destination) return;
    const originTodo = getTodoByStatusAndIdx(
      destination.index,
      destination.droppableId as Status
    );
    const payload = {
      todo: todo,
      prev: originTodo?.id,
      next: originTodo?.next,
    };
    console.log(payload);
    mutation.mutate(payload);
    // if (!destination) return;
    // setTodos((todos) => {
    //   const sourceTodos = [...todos[source.droppableId]];
    //   const targetTodos = [...todos[destination.droppableId]];
    //   const todo = {
    //     ...sourceTodos[source.index],
    //     status: destination.droppableId as Status,
    //   };
    //   sourceTodos.splice(source.index, 1);
    //   targetTodos.splice(destination.index, 0, todo);
    //   return {
    //     ...todos,
    //     [source.droppableId]: sourceTodos,
    //     [destination.droppableId]: targetTodos,
    //   };
    // });
  };

  useEffect(() => {
    if (data && !isLoading) {
      const newTodos: ITodoState = {
        TODO: data?.filter((todo) => todo.status === "TODO") ?? [],
        DOING: data?.filter((todo) => todo.status === "DOING") ?? [],
        DONE: data?.filter((todo) => todo.status === "DONE") ?? [],
      };
      setTodos(newTodos);
    }
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
