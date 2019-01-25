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
        selected: true,
        strings: {
            "unassign": "Unassign",
        },
        target: (context) => {return false;},
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
        id: "RevertAction",
        selected: true,
        strings: {
            "browse": "Browse",
        },
        target: (context) => {return false;},
    };

    beforeEach(()=>{
        wrapper = shallow(<RevertAction {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});