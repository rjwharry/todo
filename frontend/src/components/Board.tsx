import { Droppable } from "react-beautiful-dnd";
import { Status, todoStatusSelector } from "../atom/todo";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useRecoilValue } from "recoil";

interface IBoardProps {
  boardType: Status;
  idx: number;
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

function Board({ boardType }: IBoardProps) {
  const todos = useRecoilValue(todoStatusSelector(boardType));
  return (
    <>
      <Droppable key={boardType} droppableId={boardType}>
        {(provided) => (
          <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
            <Title>{boardType}</Title>
            {todos.map((todo, idx) => (
              <DraggableCard key={todo.id} todo={todo} idx={idx} />
            ))}
          </Wrapper>
        )}
      </Droppable>
    </>
  );
}

export default Board;
