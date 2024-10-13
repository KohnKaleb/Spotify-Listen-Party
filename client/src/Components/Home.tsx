import react from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Home() {
    return (
        <Container>
            <Row>
                <Col>
                    <Button variant="dark">Create Room</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="dark">Join Room</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;