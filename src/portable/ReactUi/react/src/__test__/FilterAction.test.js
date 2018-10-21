import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import FilterAction from '../components/controls/FilterAction';

configure({ adapter: new Adapter() })

// Snapshot for FilterAction
describe('>>>Control: FilterAction --- Snapshot',()=>{
    const minProps = {
        target: () => {return false;},
        text: "My Filter",
    };

    it('+++capturing Snapshot of FilterAction', () => {
        const renderedValue =  renderer.create(<FilterAction {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: FilterAction', () => {
    let wrapper;
    const minProps = {
        target: () => {return false;},
        text: "My Filter",
    };

    beforeEach(()=>{
        wrapper = shallow(<FilterAction {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
