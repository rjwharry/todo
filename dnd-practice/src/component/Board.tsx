import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled, { keyframes } from 'styled-components';
import DragabbleCard from './DragabbleCard';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { ITodo, todoState } from '../atom/todo';
import { useState } from 'react';

const blink = keyframes`
  0%{
    transform: scale(1);
    opacity: 1;
  }
  50%{
    transform: scale(1.1);
    opacity: 0.7;
  }
  100%{
    transform: scale(1.2);
    opacity: 0.5;
  }
`;

const Wrapper = styled.div`
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? '#dfe6e9'
      : props.draggingFromThisWith
        ? '#b2bec3'
        : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  margin-top: 10px;
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* animation: ${blink} 1s linear infinite; */
`;

const Icon = styled.label<{ isCreateTodo: boolean }>`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  display: ${(props) => props.isCreateTodo && 'none'};
  background-color: #74b9ff;
  &:hover {
    opacity: 0.8;
  }
  svg {
    width: 20px;
  }
`;

const Input = styled.input<{ isCreateTodo: boolean }>`
  width: 100%;
  display: ${(props) => !props.isCreateTodo && 'none'};
  border: none;
  height: 20px;
`;

const DeleteBtn = styled.button``;

interface IBoardProps {
  todos: ITodo[];
  boardId: string;
  idx: number;
}

interface IForm {
  text: string;
}

function Board({ todos, boardId, idx }: IBoardProps) {
  const [isCreateTodo, setIsCreateTodo] = useState(false);
  const setTodos = useSetRecoilState(todoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ text }: IForm) => {
    setTodos((allBoards) => {
      const newTodo = {
        id: Date.now(),
        text,
      };
      return {
        ...allBoards,
        [boardId]: [newTodo, ...allBoards[boardId]],
      };
    });
    setValue('text', '');
    setIsCreateTodo(false);
  };

  const onBlurTodo = () => {
    setValue('text', '');
    setIsCreateTodo(false);
  };

  const onClickPlus = () => {
    setIsCreateTodo(true);
  };

  const onClickDeleteBoard = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    setTodos((allBoards) => {
      const newBoards = { ...allBoards };
      delete newBoards[name];
      return {
        ...newBoards,
      };
    });
  };

  return (
    <Draggable key={boardId} draggableId={boardId} index={idx}>
      {(provided) => (
        <Droppable droppableId={boardId} type="cardDrop">
          {(providedBoard, snapshot) => (
            <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
              <Title {...provided.dragHandleProps}>{boardId}</Title>
              <DeleteBtn name={boardId} onClick={onClickDeleteBoard}>
                Delete Board
              </DeleteBtn>
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                ref={providedBoard.innerRef}
                {...providedBoard.droppableProps}
              >
                {todos.map((todo, idx) => (
                  <DragabbleCard
                    key={todo.id}
                    boardId={boardId}
                    todo={todo}
                    idx={idx}
                  />
                ))}
                {providedBoard.placeholder}
                <Form onSubmit={handleSubmit(onValid)}>
                  <Icon
                    isCreateTodo={isCreateTodo}
                    htmlFor={`todo-input-${boardId}`}
                    onClick={onClickPlus}
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </Icon>
                  <Input
                    id={`todo-input-${boardId}`}
                    isCreateTodo={isCreateTodo}
                    {...register('text', {
                      required: 'Please Write New ToDo',
                    })}
                    onBlur={onBlurTodo}
                    type="text"
                    placeholder="Write ToDo"
                  />
                </Form>
              </Area>
            </Wrapper>
          )}
        </Droppable>
      )}
    </Draggable>
  );
}

export default Board;
