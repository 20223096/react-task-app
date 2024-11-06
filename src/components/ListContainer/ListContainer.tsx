import React, {FC} from 'react'
import { IList } from '../../types';
import List from '../List/List'
import { listContainer } from './ListContainer.css';
import ActionButton from '../ActionButton/ActionButton'
type TListContainerProps = {
    boardId : string;
    lists : IList[]
}

const ListContainer :FC<TListContainerProps> = ({
    lists,
    boardId
}) => {
    return (
        <div className={listContainer}>

            {
                lists.map(list => (
                    <List key={list.listId} list={list}
                    boardId={boardId} />
                ))
            }
            <ActionButton
            boardId={boardId}
            listId={""}
            list
            />
        </div>
    )
}
export default ListContainer