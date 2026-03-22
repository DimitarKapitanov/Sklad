import React from 'react';
import { Button, Icon, Reveal } from 'semantic-ui-react';

interface RevealButtonProps {
    visibleContent: string;
    hiddenContent: string;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: string;
}

const RevealButton: React.FC<RevealButtonProps> = ({ visibleContent, hiddenContent, onClick, icon }) => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    return (
        <Reveal animated='move down' style={{ margin: '0 5px' }} >
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                    style={{ backgroundColor: '#f0f8ff' }}
                    fluid
                    content={visibleContent}
                    icon={icon}
                    onClick={isTouch ? onClick : undefined}
                />
            </Reveal.Content>
            <Reveal.Content hidden>
                <Button
                    fluid
                    basic
                    color={'google plus'}
                    onClick={onClick}
                >
                    {hiddenContent} <Icon name='arrow right' />
                </Button>
            </Reveal.Content>
        </Reveal>
    );
};

export default RevealButton;