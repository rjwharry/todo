import { Droppable } from "react-beautiful-dnd";
import { Status, todoStatusSelector } from "../atom/todo";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useRecoilState } from "recoil";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITodo, createTodo } from "../api/todo";
import { useState } from "react";
import { useForm } from "react-hook-form";
interface IBoardProps {
  boardType: Status;
  idx: number;
}

interface IForm {
  name: string;
}

const Wrapper = styled.div`
  padding: 10px;
  background-color: "#E3E5EC";
  border: 1px solid;
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;

const CreateCard = styled.form`
  border: 1px solid;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: "#FFFFFF";
  border-radius: 5px;
`;

const CardInput = styled.input`
  border: 0;
`;

const CreateButton = styled.button`
  display: flex;
  text-align: start;
  padding: 5px;
  border: 0;
  border-radius: 5px;
  background: none;
  &:hover {
    background-color: rgba(236, 240, 241, 1);
  }
  color: rgba(127, 140, 141, 1);
`;

function Board({ boardType }: IBoardProps) {
  const queryClient = useQueryClient();
  const [todos, setTodos] = useRecoilState(todoStatusSelector(boardType));
  const [cardCreate, setCardCreate] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const { mutate } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "all"] });
    },
  });
  const createNewTodo = (data: IForm) => {
    console.log(data, boardType);
    const newTodo: ITodo = {
      ...data,
      id: null,
      contents: "",
      prev: null,
      next: null,
      status: boardType,
      createdAt: new Date(),
    };
    setTodos((prevTodo) => {
      return [...prevTodo, newTodo];
    });
    mutate(newTodo);
    setValue("name", "");
    setCardCreate(false);
  };
  return (
    <>
      <Droppable key={boardType} droppableId={boardType}>
        {(provided) => (
          <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
            <Title>{boardType}</Title>
            {todos.map((todo, idx) => (
              <DraggableCard key={todo.id} todo={todo} idx={idx} />
            ))}
            {cardCreate && (
              <>
                <CreateCard onSubmit={handleSubmit(createNewTodo)}>
                  <CardInput
                    {...register("name", { required: true })}
                    onBlur={() => setCardCreate(false)}
                    placeholder="Todo 이름을 입력해주세요"
                  />
                </CreateCard>
              </>
            )}
            <CreateButton onClick={() => setCardCreate(true)}>
              + New
            </CreateButton>
          </Wrapper>
        )}
      </Droppable>
    </>
  );
}

export default Board;
