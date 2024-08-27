import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {loginTC} from "./auth-reducer";
import {Navigate} from "react-router-dom";

type ErrorType = {
    email?: string
    password?: string
}

export type LoginDataType = {
    email: string,
    password: string,
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const formik = useFormik(
        {
            initialValues: {
                email: '',
                password: '',
                rememberMe: false
            },
            validate: (values) => {
                const errors: ErrorType = {}

                const regX = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)

                if (!values.email.trim()) {
                    errors.email = 'Requred'
                } else if (!regX.test(values.email)) {
                    errors.email = 'Incorrect email address'
                }

                if (!values.password.trim()) {
                    errors.password = 'Requred'
                } else if (values.password.length < 6) {
                    errors.password = 'Must be than 6 symbols'
                }
                return errors
            },
            onSubmit: values => {
                dispatch(loginTC(values))
                formik.resetForm()
            }
        }
    )

    if (isLoggedIn) {
        return <Navigate to={"/todolists"}/>
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered
                            <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                                here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <form onSubmit={formik.handleSubmit}>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                {...formik.getFieldProps('email')}/>

                            {formik.touched.email && <div style={{color: 'red'}}>{formik.errors.email}</div>}

                            <TextField type="password"
                                       label="Password"
                                       margin="normal"
                                       {...formik.getFieldProps('password')}/>

                            {formik.touched.password && <div style={{color: 'red'}}>{formik.errors.password}</div>}

                            <FormControlLabel label={'Remember me'}
                                              control={
                                                  <Checkbox
                                                      checked={formik.values.rememberMe}
                                                      {...formik.getFieldProps('rememberMe')}/>}/>
                            <Button type={'submit'} variant={'contained'} color={'primary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}