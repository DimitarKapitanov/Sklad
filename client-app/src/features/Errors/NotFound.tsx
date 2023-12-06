import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops - we've looked everywhere but couldn't find this.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/products' primary>
                    Return to products page
                </Button>
            </Segment.Inline>
        </Segment>
    )
}