/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import RevertAction from '../components/controls/RevertAction';

configure({ adapter: new Adapter() })

// Snapshot for NextAction
describe('>>>Control: RevertAction --- Snapshot',()=>{
    const minProps = {
        id: "RevertAction",
        target: (context) => {return false;},
        selected: true,
        strings: {
            "unassign": "Unassign",
        },
    };

    it('+++capturing Snapshot of RevertAction', () => {
        const renderedValue =  renderer.create(<RevertAction {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: RevertAction', () => {
    let wrapper;
    const minProps = {
        target: (context) => {return false;},
        id: "RevertAction",
        selected: true,
        strings: {
            "browse": "Browse",
        },
    };

    beforeEach(()=>{
        wrapper = shallow(<RevertAction {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});