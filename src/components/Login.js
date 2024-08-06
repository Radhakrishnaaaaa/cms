import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { authenticate } from "../services/AWSService";
import { localData } from "../utils/storage";
import '../components/Login.css'
import ptg from "../assets/Images/logo.svg";
import { Spinner } from "react-bootstrap";
import { ToastContainer, Zoom, toast } from "react-toastify";
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formInputChange = (formField, value) => {
        if (formField === "email") {
            setEmail(value);
        }
        if (formField === "password") {
            setPassword(value);
        }
    };

    const validation = () => {
        return new Promise((resolve, reject) => {
            if (email === '' && password === '') {
                setEmailErr("Email is Required");
                setPasswordErr("Password is required");
                toast.warning("Email and Password are required");
                resolve({ email: "Email is Required", password: "Password is required" });
            }
            else if (email === '') {
                setEmailErr("Email is Required");
                toast.warning("Email is Required");
                resolve({ email: "Email is Required", password: "" });
            }
            else if (password === '') {
                setPasswordErr("Password is required");
                toast.warning("Password is required");
                resolve({ email: "", password: "Password is required" });
            }
            else if (password.length < 6) {
                setPasswordErr("must be 6 character")
                toast.warning("must be 6 character");
                resolve({ email: "", password: "must be 6 character" });
            }
            else {
                setIsLoading(true);
                resolve({ email: "", password: "" });
            }
        });
    };

    const handleClick = (e) => {
        e.preventDefault();
        setEmailErr("");
        setPasswordErr("")
        validation()
            .then((res) => {
                if (res.email === '' && res.password === '') {
                    authenticate(email, password)
                        .then((data) => {
                            console.log("Token login=> " + data.getIdToken().getJwtToken().toString())
                            localData.set("TOKEN", data.getIdToken().getJwtToken().toString())
                            const expirationTime = data.getIdToken().payload.exp;
                            localData.set("TOKEN_EXPIRATION", expirationTime);
                            localStorage.setItem('loggedIn', 'true');
                            console.log(expirationTime)                           
                            window.location.reload()
                            setIsLoading(false);
                            setLoginErr('');
                        }, (err) => {
                            toast.error(err.message);
                            console.log("Error=> " + err);
                            setLoginErr(err.message);
                            setIsLoading(false);
                        })
                        .catch(err => console.log("Error catch" + err))
                }
            }, err => {
                console.log(err);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }



    return (
        <>
            <div className="login-container">
                <div className="image-container">
                    <img src={ptg} alt="people_tech" />
                </div>
                <Form className="form-container">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => formInputChange("email", e.target.value)}
                            helperText={emailErr}
                            required={true}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required={true}
                            value={password}
                            helperText={passwordErr}
                            onChange={(e) => { formInputChange("password", e.target.value) }}
                        />
                    </Form.Group>
                    <div style={{ textAlign: "center" }}>
                        <Button variant="secondary" type="submit" onClick={(e) => handleClick(e)}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden"></span>
                    </Spinner>
                </div>
            )}
            <ToastContainer
        limit={1}
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ minWidth: "100px" }}
        transition={Zoom}
      />
        </>
    )
}

export default Login;