import { useRef, useState } from "react";
import { post } from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const CustomerAdd = () => {
  const fileRef = useRef(null);
  const usernameRef = useRef(null);
  const birthdayRef = useRef(null);
  const jobRef = useRef(null);
  const [file, setFile] = useState(null);

  const addCustomer = () => {
    console.log("addCustomer()-> ");
    const url = "http://localhost:3000/api/customerUpload";
    const formData = new FormData();

    formData.append("filename", file.name);
    formData.append("file", file);
    formData.append("username", usernameRef.current.value);
    formData.append("birthday", birthdayRef.current.value);
    formData.append("job", jobRef.current.value);

    const config = {
      Headers: {
        "content-type": "multipart/form-data",
      },
    };
    //url로 formdata를 전송
    return post(url, formData, config);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomer();
    window.location.reload();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        고객 정보 추가
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>고객 정보</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>File Upload</Form.Label>
              <Form.Control
                type="file"
                name="file"
                ref={fileRef}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                ref={usernameRef}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                ref={birthdayRef}
                placeholder="Enter Birthday"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Job</Form.Label>
              <Form.Control
                type="text"
                name="job"
                ref={jobRef}
                placeholder="Enter Job"
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
};

export default CustomerAdd;
