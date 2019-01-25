/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import DropdownUX from '../components/ui-controls/DropdownUx';

configure({ adapter: new Adapter() })

// Snapshot for DropdownUX
describe('>>>Control: DropdownUX --- Snapshot',()=>{
    const minProps = {
        collection: ["admin", "transcriber", "reviewer"],
        id: "My Dropdown",
    };

    it('+++capturing Snapshot of DropdownUX', () => {
        const renderedValue =  renderer.create(<DropdownUX {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: DropdownUX', () => {
    let wrapper;
    const minProps = {
        collection: ["admin", "transcriber", "reviewer"],
        id: "My Dropdown",
    };

    beforeEach(()=>{
        wrapper = shallow(<DropdownUX {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
