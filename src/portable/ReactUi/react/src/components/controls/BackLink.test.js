import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BackLink from './BackLink';

configure({ adapter: new Adapter() })

describe('Control: BackLink', () => {
    const minProps = {
        target: "/root",
    };

    it('renders without exploding', () => {
        expect(
            shallow(
                <BackLink {...minProps} />
            ).length
        ).toEqual(1);
    });

    it('sets link target', () => {
        const wrapper = shallow(<BackLink {...minProps}/>)
        expect(
            wrapper.find('Link').prop('to')
        ).toEqual('/root')
    });
});
