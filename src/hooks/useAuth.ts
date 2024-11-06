import { useTypedSelector } from "./redux"

export function useAuth() {
    const {id, email} = useTypedSelector((state) => state.user)
    return {
        isAuth : !!email, //이메일이 있으면 isAuth를 true라고 해줌
        email,
        id
    }
}
//hooks를 호출하면 로그인이 되어있는지 안되어있는지 로그인이 되어있으면
//id랑 비밀번호를 알려주도록 되어있음
