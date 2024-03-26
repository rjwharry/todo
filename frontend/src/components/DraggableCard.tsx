import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodo, deleteTodo } from "../api/todo";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { todoState } from "../atom/todo";

interface IDraggableCardProps {
  todo: ITodo;
  idx: number;
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
  /* text-align: start; */
  font-weight: 600;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  cursor: pointer;
  svg {
    width: 10px;
  }
`;

const CancleButton = styled.button`
  cursor: pointer;
  background-color: rgba(52, 152, 219, 1);
`;

const DeleteModal = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 250px;
  height: 150px;
  margin: 0 auto;
  padding: 30px;
  left: 0;
  right: 0;
  border: 2px solid;
  border-radius: 20px;
  background-color: white;
`;

function DraggableCard({ todo, idx }: IDraggableCardProps) {
  const queryClient = useQueryClient();
  const [todos, setTodos] = useRecoilState(todoState);
  const [cardDelete, setCardDelete] = useState(false);
  const mutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", "all"] });
    },
  });
  const deleteCard = () => {
    if (!!!todo.id) return;
    mutation.mutate(todo.id);
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
  return (
    <>
      {cardDelete && (
        <>
          <Overlay onClick={() => setCardDelete(false)} />
          <DeleteModal>
            <Title>정말로 {todo.name}을(를) 삭제하시겠습니까?</Title>
            <DeleteButton
              onClick={deleteCard}
              style={{ backgroundColor: "rgba(231, 76, 60,1.0)" }}
            >
              DELETE
            </DeleteButton>
            <CancleButton onClick={() => setCardDelete(false)}>
              CANCEL
            </CancleButton>
          </DeleteModal>
        </>
      )}
      <Draggable key={todo.id} draggableId={todo.id + ""} index={idx}>
        {(provided, snapshot) => (
          <Card
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <CardHeader>
              <Title>{todo.name}</Title>
              {/* <Contents>{todo.contents}</Contents> */}
              <DeleteButton
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
              </DeleteButton>
            </CardHeader>
          </Card>
        )}
      </Draggable>
    </>
  );
}

export default DraggableCard;
