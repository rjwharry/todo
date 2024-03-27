import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodo, IUpdateTodo, deleteTodo, updateTodo } from "../api/todo";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { todoState } from "../atom/todo";
import { useForm } from "react-hook-form";

interface IDraggableCardProps {
  todo: ITodo;
  idx: number;
}
interface IForm {
  name: string;
  contents: string;
}

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
`;

const Card = styled.div<{ isDragging: boolean }>`
  border: 1px solid;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) => (props.isDragging ? "#74b9ff" : "#FFFFFF")};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : "none"};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h4`
  font-weight: 600;
  font-size: 18px;
`;

const Contents = styled.p``;

const Button = styled.button`
  cursor: pointer;
  svg {
    width: 10px;
  }
`;

const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;
  padding: 30px;
  left: 0;
  right: 0;
  border: 2px solid;
  border-radius: 20px;
  background-color: white;
`;

const Form = styled.form``;

const NameInput = styled.input``;

const ContentsInput = styled.textarea``;

const ModalContents = styled.div`
  display: grid;
  width: 200px;
  grid-template-rows: 1fr 2fr;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

function DraggableCard({ todo, idx }: IDraggableCardProps) {
  const queryClient = useQueryClient();
  const [todos, setTodos] = useRecoilState(todoState);
  const [cardDelete, setCardDelete] = useState(false);
  const [cardUpdate, setCardUpdate] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: {
      name: todo.name,
      contents: todo.contents ?? "",
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "all"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "all"] });
    },
  });
  const deleteCard = () => {
    if (!!!todo.id) return;
    deleteMutation.mutate(todo.id);
    const targetTodos = [...todos[todo.status]];
    targetTodos.splice(idx, 1);
    setTodos((oldTodos) => {
      return {
        ...oldTodos,
        [todo.status]: targetTodos,
      };
    });
    setCardDelete(false);
  };

  const updateCard = (data: IForm) => {
    console.log(data);
    const updateTodo = { ...todo };
    updateTodo.name = data.name;
    updateTodo.contents = data.contents;
    const todoDto: IUpdateTodo = {
      todo: updateTodo,
      prev: -1,
      next: -1,
    };
    updateMutation.mutate(todoDto);
    setCardUpdate(false);
  };
  return (
    <>
      {cardDelete && (
        <>
          <Overlay onClick={() => setCardDelete(false)} />
          <Modal
            style={{
              width: "250px",
              height: "150px",
            }}
          >
            <Title>정말로 {todo.name}을(를) 삭제하시겠습니까?</Title>
            <Button
              onClick={deleteCard}
              style={{ backgroundColor: "rgba(231, 76, 60,1.0)" }}
            >
              DELETE
            </Button>
            <Button
              onClick={() => setCardDelete(false)}
              style={{ backgroundColor: "rgba(52, 152, 219, 1)" }}
            >
              CANCEL
            </Button>
          </Modal>
        </>
      )}
      {cardUpdate && (
        <>
          <Overlay onClick={() => setCardUpdate(false)} />
          <Modal
            style={{
              display: "grid",
              gridTemplateRows: "2fr 1fr",
              width: "500px",
              height: "250px",
            }}
          >
            <Form onSubmit={handleSubmit(updateCard)}>
              <ModalContents>
                <NameInput
                  {...register("name", { minLength: 1 })}
                  placeholder={todo.name}
                />
                <ContentsInput
                  {...register("contents")}
                  placeholder={todo.contents ?? ""}
                />
              </ModalContents>
              <ButtonGroup>
                <Button type="submit">UPDATE</Button>
                <Button
                  onClick={() => setCardUpdate(false)}
                  style={{ backgroundColor: "rgba(52, 152, 219, 1)" }}
                >
                  CANCEL
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </>
      )}
      <Draggable key={todo.id} draggableId={todo.id + ""} index={idx}>
        {(provided, snapshot) => (
          <Card
            onClick={() => setCardUpdate(true)}
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <CardHeader>
              <Title>{todo.name}</Title>
              {/* <Contents>{todo.contents}</Contents> */}
              <Button
                onClick={() => setCardDelete(true)}
                style={{ border: 0, background: "none" }}
              >
                <svg
                  data-slot="icon"
                  fill="none"
                  stroke-width="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  ></path>
                </svg>
              </Button>
            </CardHeader>
          </Card>
        )}
      </Draggable>
    </>
  );
}

export default DraggableCard;
