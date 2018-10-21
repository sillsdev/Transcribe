import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import JumpBack from '../components/controls/JumpBack';
import { JSDOM } from 'jsdom';

configure({ adapter: new Adapter() })

// Snapshot for JumpBack
describe('>>>Control: JumpBack --- Snapshot',()=>{
    const minProps = {
        jumpChange: actions.jumpChange,
        selectedUser: "admin",
        users: [{username:{id:"admin"},hotkey:[{id:"back", text:"F2"}]}],
    };

    it('+++capturing Snapshot of JumpBack', () => {
        const { document } = (new JSDOM(<JumpBack {...minProps}/>)).window
        const renderedValue =  renderer.create(document.querySelector('div')).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: JumpBack', () => {
    let wrapper;
    const minProps = {
        jumpChange: actions.jumpChange,
        selectedUser: undefined,
        users: [],
    };

    beforeEach(()=>{
        wrapper = shallow(<JumpBack {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
