import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";

export default function HomePage() {
    return (
        <Container style={{matginTop: '7em'}}>
            <h1>Home Page</h1>
            <h3>Към <Link to='/products'>Продуктите</Link></h3>
        </Container>
    )
}