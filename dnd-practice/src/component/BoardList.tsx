import styled from 'styled-components';
import Board from './Board';
import { useRecoilState, useRecoilValue } from 'recoil';
import { todoSelector, todoState } from '../atom/todo';
import { useForm } from 'react-hook-form';
import { Droppable } from 'react-beautiful-dnd';

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
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

interface IForm {
  boardId: string;
}

function BoardList() {
  const boardList = useRecoilValue(todoSelector);
  const [todos, setToDos] = useRecoilState(todoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ boardId }: IForm) => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId.toUpperCase()]: [],
      };
    });
    setValue('boardId', '');
  };

  return (
    <Droppable droppableId="allBoards" direction="horizontal" type="boardDrop">
      {(provided) => (
        <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
          <Boards>
            {boardList.map((boardId, idx) => (
              <Board
                key={boardId}
                todos={todos[boardId]}
                boardId={boardId}
                idx={idx}
              />
            ))}
            {provided.placeholder}
          </Boards>
          <form onSubmit={handleSubmit(onValid)}>
            <input
              {...register('boardId', {
                required: 'Please Write Board Name',
              })}
              placeholder="Please Write Board Name"
              type="text"
            />
          </form>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default BoardList;
