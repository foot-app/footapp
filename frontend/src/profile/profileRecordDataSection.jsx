import React from 'react'

import Grid from '../common/layout/grid'
import Row from '../common/layout/row'
import If from '../common/operator/if'

export default props => (
    <section className='record-data-section'>
        <If test={props.profilePicture}>
            <Row id='profilePicture-row'>
                <Grid cols='12' className='text-center'>
                    <p>
                        <img src={props.profilePicture || ''} alt={props.name || ''} data-test-id='profilePicture' />
                    </p>
                </Grid>
            </Row>
        </If>
        <Row id='name-row'>
            <Grid cols='12' className='text-center'>
                <p data-test-id='name'>{props.name}</p>
            </Grid>
        </Row>
        <Row id='nickname-row'>
            <Grid cols='12' className='text-center'>
                <p data-test-id='nickname'><span id='best-know-as-span'>Mais conhecido(a) como </span>{props.nickname}</p>
            </Grid>
        </Row>
    </section>
)