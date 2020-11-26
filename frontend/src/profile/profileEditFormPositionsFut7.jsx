import React from 'react'

import InputAndLabelCheckbox from '../common/form/inputAndLabelCheckbox'
import Grid from '../common/layout/grid'

export default props => (
    <Grid cols='12 4' offset='0 2' className='profileEdit-positions-fut7 text-left'>
        <InputAndLabelCheckbox name='fut7-positions-gk' value='gk' label='Goleiro' />
        <InputAndLabelCheckbox name='fut7-positions-zc' value='zc' label='Zagueiro' />
        <InputAndLabelCheckbox name='fut7-positions-le' value='le' label='Lateral esquerdo' />
        <InputAndLabelCheckbox name='fut7-positions-ld' value='ld' label='Lateral direito' />
        <InputAndLabelCheckbox name='fut7-positions-mce' value='mce' label='Meio campo esquerdo' />
        <InputAndLabelCheckbox name='fut7-positions-mcd' value='mcd' label='Meio campo direito' />
        <InputAndLabelCheckbox name='fut7-positions-atc' value='atc' label='Atacante' />
    </Grid>
)