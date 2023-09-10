import {useState} from "react";
import styles from './Login.module.css';
import TextInput from '../../components/TextInput/TextInput';
import loginSchema from '../../schemas/loginSchema';
import {useFormik} from "formik";
import {login} from '../../api/internal';

import {setUser}  from '../../store/userSlice';
import {useDispatch} from "react-redux";
import { useNavigate } from 'react-router-dom';
function Login()
{
    const dispatch =useDispatch();
    const navigate=useNavigate();
    const [error,setError]=useState('');

    const handleLogin = async()=>{

        const data={
            username: values.username,
            password: values.password
        }
        
        const response = await login(data);
        if(response.status===200)
        {
            //set user
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth
            }
            dispatch(setUser(user));
            // redirect to home page
            navigate('/')
        }
        else if (response.code === 'ERR_BAD_REQUEST' ) {
            // Display error
            setError(response.response.data.message);
        } 
        
    }
    const {values,touched,handleBlur,handleChange,errors} = useFormik({
        initialValues:{
            username: '',
            password: ''
        },
        validationSchema:loginSchema
    });
    
    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginHeader}>Log in to your account</div>

            <TextInput type="text"
            value={values.username}
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="username"
            error={errors.username && touched.username ? 1:undefined}
            errormessage={errors.username}
            />
            
            <TextInput 
            type= "password"
            name="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="password" 
            error = {errors.password && touched.password ? 1:undefined}
            errormessage={errors.username}
            />
            <button className={styles.loginButton} onClick={handleLogin} disabled={!values.username || !values.password || errors.username || errors.password }>Log In</button>
            <span>
                Don't have an account? <button className={styles.createAccount} onClick={()=>navigate('/signup')}>Register</button>
            </span>
            {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
        </div>
    )
}

export default Login;