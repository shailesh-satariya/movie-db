import React from 'react';

import {cleanup, render} from '../../../test-utils';
import Duration from '../duration';
import {InputElement, InputObj} from "../../../types";

describe('Duration', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders without error', () => {
        render(<Duration
            name={'duration'} label={'Duration'} error={''} value={0}
            onChange={
                ({currentTarget}: InputObj | React.ChangeEvent<InputElement>) => (currentTarget)}/>);
    });
});
