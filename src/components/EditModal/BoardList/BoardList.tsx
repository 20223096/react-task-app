import React, {FC, useRef, useState} from 'react'
import { useTypedDispatch, useTypedSelector } from '../../../hooks/redux';
import SideForm from './SideForm/SideForm';
import {FiLogIn, FiPlusCircle} from 'react-icons/fi'
import clsx from 'clsx';
import {GoSignOut} from 'react-icons/go'
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import { addButton, addSection, boardItem, boardItemActive, container, title } from './BoardList.css';
import { app } from '../../../firebase';
import { removeUser, setUser } from '../../../store/slices/userSlice';
import { useAuth } from '../../../hooks/useAuth';
type TBoardListProps = {
    activeBoardId : string;
    setActiveBoardId : React.Dispatch<React.SetStateAction<string>>
}
const BoardList :FC<TBoardListProps>= ({
    activeBoardId,
    setActiveBoardId
}) => {
    const dispatch = useTypedDispatch()
    const {boardArray} = useTypedSelector(state => state.boards)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider()
    const {isAuth} = useAuth(); //isAuth만 가져옴
    const handleClick =() => {
        setIsFormOpen(!isFormOpen)
        setTimeout(() => {
            inputRef.current?.focus() //값이들어가야 input에 등록이 되기 떄문에 timing조절해줌
        }, 0)
    }
    const handleLogin = () => {
        signInWithPopup(auth, provider) //팝업으로 로그인 인증 도와줌
        .then(userCredential => {
            console.log(userCredential); //유저에 대한 정보를 담음
//redux store에 이 정보 넣어줘서 전역으로 사용할 거임
            dispatch(setUser({
                email : userCredential.user.email,
                id : userCredential.user.uid,
            })) //redux store에 필요한 데이터 넣어줌
        })
        .catch(error => {
            console.error(error);
        })
    }
    const handleSignOut = () => { //firebase에서 제공해준 기능으로 로그아웃함
        signOut(auth)
        .then(()=> { //유저 데이터 초기화시켜주기
            dispatch(removeUser()) //payload넣어줄 건 없음
        })
        .catch((error) => {
            console.error(error)
        })
    }
    return (
        <div className={container}>
            <div className={title}>
                게시판 : 
            </div>
            {boardArray.map((board, index) => (
                <div key={board.boardId}
                onClick={() => setActiveBoardId(boardArray[index].boardId)}
                className={
                    clsx(
                        {
                            [boardItemActive]:
                            boardArray.findIndex(board => board.boardId === activeBoardId) === index,
                        },
                        {
                            [boardItem]:
                            boardArray.findIndex(board => board.boardId === activeBoardId) !== index
                        }
                    
                    )
                }>
                    <div>
                        {board.boardName}
                    </div>
                </div>
            ))}
            <div className={addSection}>
                {
                    isFormOpen ?
                    <SideForm inputRef={inputRef} setIsFormOpen={setIsFormOpen}/>
                    :
                    <FiPlusCircle className={addButton} onClick={handleClick}/>

                }
                {isAuth
                ?<GoSignOut className={addButton} onClick={handleSignOut}/>
                :
                <FiLogIn className = {addButton} onClick={handleLogin}/>
                }
            </div>
        </div>
    )
}

export default BoardList
