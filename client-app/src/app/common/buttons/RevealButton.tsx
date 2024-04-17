import React from 'react';
import { Button, Icon, Reveal } from 'semantic-ui-react';

interface RevealButtonProps {
    visibleContent: string;
    hiddenContent: string;
    onClick?: () => void;
    icon?: string;
}

const RevealButton: React.FC<RevealButtonProps> = ({ visibleContent, hiddenContent, onClick, icon }) => {

    return (
        <Reveal animated='move down' style={{ margin: '0 5px' }}>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                    style={{ backgroundColor: '#f0f8ff' }}
                    fluid
                    content={visibleContent}
                    icon={icon}
                />
            </Reveal.Content>
            <Reveal.Content hidden>
                <Button
                    fluid
                    basic
                    color={'blue'}
                    onClick={onClick}
                >
                    {hiddenContent} <Icon name='arrow right' />
                </Button>
            </Reveal.Content>
        </Reveal>
    );
};

export default RevealButton;