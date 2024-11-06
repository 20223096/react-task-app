import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IBoard, IList, ITask} from '../../types'
type TBoardsState = {
    modalActive : boolean;
    boardArray : IBoard[]
}
type TAddBoardAction = {
    board : IBoard
}
type TDeleteListAction = {
    boardId : string;
    listId : string;
}
type TDeleteTaskAction = {
    boardId : string;
    listId : string;
    taskId : string;
}
type TAddListAction = {
    boardId : string;
    list : IList;
}
type TSortAction = {
    boardIndex : number;
    droppableIdStart : string;
    droppableIdEnd : string;
    droppableIndexStart : number;
    droppableIndexEnd : number;
    draggableId : string;
}
type TAddTaskAction = {
    boardId : string;
    listId : string;
    task : ITask;
}
type TDeleteBoardAction = {
    boardId : string;
}
const initialState : TBoardsState = {
    modalActive : false,
    boardArray : [{
        boardId : 'board-9',
        boardName : "첫번째 게시물",
        lists : [
            {
                listId : "list-0",
                listName : "List 1",
                tasks : [
                    {
                        taskId : "task-0",
                        taskName : "Task 1",
                        taskDescription : "Description",
                        taskOwner : "John",
                    },
                    {
                        taskId : "task-1",
                        taskName : "Task 2",
                        taskDescription : "Description",
                        taskOwner : "John",
                    }
                ]
            },
            {
                listId : "list-1",
                listName : "List 2",
                tasks : [
                    {
                        taskId : "task-3",
                        taskName : "Task 3",
                        taskDescription : "description",
                        taskOwner : "John"
                    }
                ]
            }
        ]
    }]
}
const boardsSlice = createSlice({
    name : 'boards',
    initialState,
    reducers : {
        addBoard : (state, {payload} : PayloadAction<TAddBoardAction>) => {
            state.boardArray.push(payload.board);
        },
        addList : (state, {payload} : PayloadAction<TAddListAction>) => {
            state.boardArray.map(board=> board.boardId===payload.boardId
                ? {...board, lists: board.lists.push(payload.list)}
                :
                board
            )
        },
        addTask : (state, {payload} : PayloadAction<TAddTaskAction>) => {
            state.boardArray.map(board=>
                board.boardId === payload.boardId
                ? {...board,
                    lists : board.lists.map(list =>
                        list.listId === payload.listId
                        ?   {...list, tasks : list.tasks.push(payload.task)}
                        :
                        list
                    )
                }
                : board
            )
        },
        updateTask : (state, {payload} : PayloadAction<TAddTaskAction>) => {
            state.boardArray = state.boardArray.map(board =>
                board.boardId === payload.boardId
                ?
                { ...board,
                    lists : board.lists.map(
                        list => list.listId === payload.listId
                        ? { ...list, tasks : list.tasks.map(task =>
                            task.taskId === payload.task.taskId
                            ? payload.task
                            :task
                        )}
                    : list
                    )
                }
                : board
            )
        },
        deleteBoard : (state, {payload} : PayloadAction<TDeleteBoardAction>) => {
            state.boardArray = state.boardArray.filter(
                board => board.boardId !== payload.boardId
            )
        },
        deleteTask : (state, {payload} : PayloadAction<TDeleteTaskAction>) => {
            state.boardArray = state.boardArray.map(board =>
                board.boardId === payload.boardId ?
                {...board, lists : board.lists.map(list =>
                    list.listId === payload.listId
                    ? {
                        ...list, tasks : list.tasks.filter(
                            task => task.taskId !== payload.taskId
                        )
                    } : list
                )} 
                : board
            )
        },
        deleteList : (state, {payload} : PayloadAction<TDeleteListAction>) => {
            state.boardArray = state.boardArray.map(
                board =>
                    board.boardId === payload.boardId
                ?
                {
                    ...board,
                    lists : board.lists.filter(
                        list => list.listId !== payload.listId
                    )
                }
                :
                board
            )
        },
        setModalActive : (state, {payload} : PayloadAction<boolean>) => {
            state.modalActive = payload
        },
        sort: (state, {payload} : PayloadAction<TSortAction>) => {
//same list일 때
if (payload.droppableIdStart === payload.droppableIdEnd) {
    const list = state.boardArray[payload.boardIndex].lists.find(
        list => list.listId === payload.droppableIdStart
    )
    
    //변경시키는 아이템을 배열에서 지워주고 return 값으로 지워진 아이템 잡아줌
    const card = list?.tasks.splice(payload.droppableIndexStart, 1); //splice해서 1을 하면 대체하거나 지움
    list?.tasks.splice(payload.droppableIndexEnd, 0, ...card!) //0이면 insert, card!라고 하면 undefined없다는 뜻
}

//other list
if (payload.droppableIdStart !== payload.droppableIdEnd) {
    const listStart = state.boardArray[payload.boardIndex].lists.find(
        list => list.listId === payload.droppableIdStart
    )
    const card = listStart!.tasks.splice(payload.droppableIndexStart, 1);
    const listEnd = state.boardArray[payload.boardIndex].lists.find(
        list => list.listId === payload.droppableIdEnd
    )
    listEnd?.tasks.splice(payload.droppableIndexEnd, 0, ...card);
}
}
}
})

export const {deleteBoard, addBoard, deleteList, setModalActive, addTask, addList, deleteTask, updateTask, sort} = boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;