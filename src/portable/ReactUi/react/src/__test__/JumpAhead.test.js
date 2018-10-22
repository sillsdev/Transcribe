import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import JumpAhead from '../components/controls/JumpAhead';

configure({ adapter: new Adapter() })

// Snapshot for JumpAhead
describe('>>>Control: JumpAhead --- Snapshot',()=>{
    const minProps = {
        jumpChange: actions.jumpChange,
        selectedUser: "admin",
        users: [{username:{id:"admin"},hotkey:[{id:"forward", text:"F3"}]}],
    };

    it('+++capturing Snapshot of JumpAhead', () => {
        const renderedValue =  renderer.create(<JumpAhead {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: JumpAhead', () => {
    let wrapper;
    const minProps = {
        jumpChange: actions.jumpChange,
        selectedUser: undefined,
        users: [],
    };

    beforeEach(()=>{
        wrapper = shallow(<JumpAhead {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
