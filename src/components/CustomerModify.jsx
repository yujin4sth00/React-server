
import { useState } from "react";
import { post } from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
const CustomerModify=(props)=>{
    //상태변수 선언
    const [username, setUsername]=useState(props.name);
    const [job, setJob]=useState(props.job);
    const [birthday, setBirthday]=useState(props.birthday);
    const [file, setFile]=useState(null);

    const modifyCustomer = () => {
        console.log("modifyCustomer()-> ");
        const url = "http://localhost:3000/api/customermodify";
        const formData = new FormData();
    
        formData.append("filename", file.name);
        formData.append("file", file);
        formData.append("username",username);
        formData.append("birthday",birthday);
        formData.append("job", job);
        formData.append("id", props.id);
    
        const config = {
          Headers: {
            "content-type": "multipart/form-data",
          },
        };
        //url로 formdata를 전송
        return post(url, formData, config);
      };
    const handleSubmit=(e)=>{
        e.preventDefault();
        modifyCustomer();
        window.location.reload();
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <>
        <Button variant="outline-primary" onClick={handleShow}>
          수정
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>고객 정보(수정)</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>File Upload</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={(e) => {
                    return setFile(e.target.files[0]);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e)=>{
                    setUsername(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Birthday</Form.Label>
                <Form.Control
                  type="date"
                  name="birthday"
                  value={birthday}
                  onChange={(e)=>{
                    setBirthday(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Job</Form.Label>
                <Form.Control
                  type="text"
                  name="job"
                  value={job}
                  onChange={(e)=>{
                    setJob(e.target.value);
                  }}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button type="submit" variant="primary" onClick={handleClose}>
                저장
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                닫기
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
}

export default CustomerModify;