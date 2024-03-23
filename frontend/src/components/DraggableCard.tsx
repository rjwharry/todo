import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodo } from "../api/todo";

interface IDraggableCardProps {
  todo: ITodo;
  idx: number;
}

const Card = styled.div<{ isDragging: boolean }>`
  border: 1px solid;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) => (props.isDragging ? "#74b9ff" : "#FFFFFF")};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : "none"};
`;

const Title = styled.h4`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;

function DraggableCard({ todo, idx }: IDraggableCardProps) {
  return (
    <>
      <Draggable key={todo.id} draggableId={todo.id + ""} index={idx}>
        {(provided, snapshot) => (
          <Card
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <Title>{todo.name}</Title>
            {/* <Contents>{todo.contents}</Contents> */}
          </Card>
        )}
      </Draggable>
    </>
  );
}

export default DraggableCard;
