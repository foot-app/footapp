import React from 'react'

import InputAndLabelCheckbox from '../common/form/inputAndLabelCheckbox'
import Grid from '../common/layout/grid'

export default props => (
    <Grid cols='12 4' offset='0 2' className='profileEdit-positions-futsal text-left'>
        <InputAndLabelCheckbox name='futsal-positions-gk' value='gk' label='Goleiro' />
        <InputAndLabelCheckbox name='futsal-positions-fx' value='fx' label='Fixo' />
        <InputAndLabelCheckbox name='futsal-positions-ae' value='ae' label='Ala equerdo' />
        <InputAndLabelCheckbox name='futsal-positions-ad' value='ad' label='Ala direito' />
        <InputAndLabelCheckbox name='futsal-positions-pv' value='pv' label='Pivô' />
    </Grid>
)