/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import TaskItem from '../components/controls/TaskItem';
import TaskChips from '../components/controls/TaskChips';

configure({ adapter: new Adapter() })

// Snapshot for TaskItem
describe('>>>Control: TaskItem --- Snapshot',()=>{
    const minProps = {
        avatar: '',
        id: "TaskItem",
        length: 100,
        name: 'LUK-001-001006',
        taskChips: ["transcribe", "mytasks"],
    };

    it('+++capturing Snapshot of TaskItem', () => {
        const renderedValue =  renderer.create(<TaskItem {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: TaskItem', () => {
    let wrapper;
    const minProps = {
        avatar: '',
        id: "TaskItem",
        length: 100,
        name: 'LUK-001-001006',
        taskChips: ["transcribe", "mytasks"],
    };

    beforeEach(()=>{
        wrapper = shallow(<TaskItem {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
