import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { ITodo, todoState } from '../atom/todo';
import { useSetRecoilState } from 'recoil';

const Card = styled.div<{ isDragging: boolean }>`
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isDragging ? '#74b9ff' : props.theme.cardColor};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const DeletBtn = styled.button``;

interface IDragabbleCardProps {
  boardId: string;
  todo: ITodo;
  idx: number;
}

function DragabbleCard({ boardId, todo, idx }: IDragabbleCardProps) {
  const setTodos = useSetRecoilState(todoState);
  const onClickDeleteCard = (idx: number) => {
    setTodos((allBoards) => {
      const targetBoard = [...allBoards[boardId]];
      targetBoard.splice(idx, 1);
      return {
        ...allBoards,
        [boardId]: targetBoard,
      };
    });
  };

  return (
    <>
      <Draggable key={todo.id} draggableId={todo.id + ''} index={idx}>
        {(provided, snapshot) => (
          <Card
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {todo.text}
            <DeletBtn onClick={() => onClickDeleteCard(idx)}>
              Delete Card
            </DeletBtn>
          </Card>
        )}
      </Draggable>
    </>
  );
}

export default React.memo(DragabbleCard);
