import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import BoardList from './component/BoardList';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { todoSelector, todoState } from './atom/todo';
import { useEffect } from 'react';

function App() {
  const [todos, setTodos] = useRecoilState(todoState);
  const setBoardList = useSetRecoilState(todoSelector);

  const onDragCardEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    setTodos((allBoards) => {
      const sourceBoard = [...allBoards[source.droppableId]];
      const targetBoard =
        source.droppableId === destination.droppableId
          ? sourceBoard
          : [...allBoards[destination.droppableId]];
      const copiedTodo = sourceBoard[source.index];
      sourceBoard.splice(source.index, 1);
      targetBoard.splice(destination.index, 0, copiedTodo);
      return {
        ...allBoards,
        [source.droppableId]: sourceBoard,
        [destination.droppableId]: targetBoard,
      };
    });
  };

  const onDragBoardEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    setBoardList((boardList) => {
      const newBoardList = [...boardList];
      const targetBoard = newBoardList[source.index];
      newBoardList.splice(source.index, 1);
      newBoardList.splice(destination.index, 0, targetBoard);
      return [...newBoardList];
    });
  };

  const onDrageEnd = (info: DropResult) => {
    const { type } = info;
    if (type === 'cardDrop') {
      onDragCardEnd(info);
    } else {
      onDragBoardEnd(info);
    }
  };

  useEffect(() => {
    localStorage.setItem('todo', JSON.stringify(todos));
  }, [todos]);
  return (
    <>
      <DragDropContext onDragEnd={onDrageEnd}>
        <BoardList />
      </DragDropContext>
    </>
  );
}

export default App;
