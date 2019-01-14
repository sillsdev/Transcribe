/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import TaskChips from '../components/controls/TaskChips';

configure({ adapter: new Adapter() })

// Snapshot for TaskChips
describe('>>>Control: TaskChips --- Snapshot',()=>{
    const minProps = {
        text: ["upload", "alltasks"],
    };

    it('+++capturing Snapshot of TaskChips', () => {
        const renderedValue =  renderer.create(<TaskChips {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: TaskChips', () => {
    let wrapper;
    const minProps = {
        text: ["upload", "alltasks"],
    };

    beforeEach(()=>{
        wrapper = shallow(<TaskChips {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
