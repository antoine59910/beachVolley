import React from 'react'
import styled from 'styled-components'

import Text from '../Text'

const InscribedTeams = ({ inscription }) => {

    const { equipe, id } = inscription

    return (
        <>

            {
                equipe &&
                equipe.map((equipe, index) =>
                    <Container key={index}>
                        <Text large center >{equipe}</Text>
                    </Container>
                )
            }
        </>
    )
}

export default InscribedTeams

const Container = styled.View`
`;
