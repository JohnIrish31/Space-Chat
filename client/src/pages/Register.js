import React, { useState } from 'react'
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useRegisterUserMutation } from "../service/Api";
import { Link, useNavigate} from "react-router-dom";
import Avatar from "../images/avatar1.jpg"


function Register() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const Navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);


  function uploadImage(e) {
  const file = e.target.files[0];
  if (file.size >= 1048576) {
    return alert("file size must be 1mb under")
  } else {
    setImage(file);
    setImgPreview(URL.createObjectURL(file))
  }
  };
  
  async function uploadAvatar() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "johnIrish")
    try {
      setUploadingImage(true);
      let res = await fetch("https://api.cloudinary.com/v1_1/dhjojkvfe/image/upload", {
        method: "POST",
        body: data
      })
      const urlData = await res.json();
      setUploadingImage(false);
      return urlData.url
    } catch (error) {
      setUploadingImage(false);
      console.log(error)
    }
  }

  async function holdRegister(e) {
    e.preventDefault();
    
    if (!image) return alert("Ranger Please Upload Your Photo");
    const url = await uploadAvatar(image);
    console.log(url)

    registerUser({ firstName, lastName, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        Navigate("/chats")
      }
    });
}

  return (
    <Container>
      <Row>
        <Col md={6} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form className="form" onSubmit={holdRegister}>
            <h1 className="text-center">Register Now</h1>
            <div className="register-avatar-pic_container">
              <img src={imgPreview || Avatar} alt="avaImg" className="register-avatar-pic" />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={uploadImage} />
            </div>
            {error && <p className="alert alert-danger">{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Last Name"
              onChange={(e) => setLastname(e.target.value)} value={lastName}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)} value={email}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} value={password}/>
            </Form.Group>
            <Button id="register-btn" type="submit">
              {uploadingImage || isLoading ? "Enlisting You now..." : "Enlist" }
            </Button>
            <div className="py-4">
              <p className="text-center">
                You Have an Account Right? <Link to="/login">Ready?</Link>
              </p>
            </div>
          </Form>
        </Col>
         <Col md={6} className="register-bg"></Col>
      </Row>
    </Container>
  )
}

export default Register