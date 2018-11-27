import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import PencilAction from '../components/controls/PencilAction';

configure({ adapter: new Adapter() })

// Snapshot for PencilAction
describe('>>>Control: PencilAction --- Snapshot',()=>{
    const minProps = {
        target: (context) => {return false;},
    };

    it('+++capturing Snapshot of PencilAction', () => {
        const renderedValue =  renderer.create(<PencilAction {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: PencilAction', () => {
    let wrapper;
    const minProps = {
        target: (context) => {return false;},
    };

    beforeEach(()=>{
        wrapper = shallow(<PencilAction {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
