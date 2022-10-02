import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import functions from '../../../additional_info/functions';
import {datos} from '../../../additional_info/comments';
import Comment from '../comments/Comment';
import styles from './Visitor_1.module.css';
import sr, { config } from './scroll';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getFeedback } from '../../../features/homeVisitor/visitorSlice';


interface data {
    [key: string]: {
        avatar?: any,
        name?: string,
        comment: string
    }
}

export default function Visitor1() {
    const navigate = useNavigate();

    const feedbacks = useAppSelector(state => state.visitor.feedbacks)
    const dispatch = useAppDispatch()

    const divComment1 = useRef<HTMLHeadingElement>(null);
    const divComment2 = useRef<HTMLHeadingElement>(null);
    const divComment3 = useRef<HTMLHeadingElement>(null);

    const [datosState, setDatosState] = useState(datos)
    const [comments, setComments] = useState<any>(functions.random(datosState));
    const [added, setAdded] = useState(false)

    const onClick = () => {
        navigate('/auth/sing-up')
    }
    

    useEffect(() => {
        dispatch(getFeedback())
    }, []);

    useEffect(() => {

        if (!added && feedbacks.length) {
            setDatosState([...datosState, ...feedbacks])
            setAdded(true)
        }
 
        if (added) {
            let interval = setInterval(() => {
                setComments(functions.random(datosState));
            }, 5000);
            return () => {
                clearInterval(interval)
            }
        }


    }, [feedbacks, added])


    useEffect(() => {

        console.log(datosState, "iam")

    }, [datosState])
    


    
    useLayoutEffect(() => {
        sr.reveal(divComment1.current, config);
        // sr.reveal(divComment2.current, config);
        // sr.reveal(divComment3.current, config);
      },[])

    return (
        <div className={styles.container} >
            <div className={styles.container_2}>
                <h1 className={styles.tittle}>FIT FOCUS</h1>
                <div className={styles.text}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p>¿No sabes como empezar a cambiar</p>
                        <p>tu vida y mejorar tu salud?</p>
                    </div>
                    <p className={styles.text_1}>No tienes que preocuparte, nosotros te ayudamos a lograrlo</p>
                    <button className={styles.btn} onClick={onClick}>HAZ CLICK AQUI</button>
                </div>
            </div>
            <div className={styles.container_3}>
                <p className={styles.tittle_2}>Lo que opinan algunos miembros:</p>
                <div className={styles.comments} ref={divComment1}>
                    {comments?.map((comment:any) => (
                        <Comment avatar={comment.avatar} comment={comment.comment} name={comment.name} />
                    ))}
                    {/* {comments&&<div ref={divComment1}><Comment data={(datos as data)[comments[0]]} /></div>}
                    {comments&&<div ref={divComment2}><Comment data={(datos as data)[comments[1]]} /></div>}
                    {comments&&<div ref={divComment3}><Comment data={(datos as data)[comments[2]]} /></div>} */}
                </div>
            </div>
        </div>
    )
}
