/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import Empt from '../components/controls/TaskItem';
import EmptyTaskItem from '../components/controls/EmptyTaskItem';

configure({ adapter: new Adapter() })

// Snapshot for TaskItem
describe('>>>Control: TaskItem --- Snapshot',()=>{
    const minProps = {
        id: "EmptyTaskItem",
        text: 'Text Message',
    };

    it('+++capturing Snapshot of TaskItem', () => {
        const renderedValue =  renderer.create(<EmptyTaskItem {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: TaskItem', () => {
    let wrapper;
    const minProps = {
        id: "EmptyTaskItem",
        text: 'Text Message',
    };

    beforeEach(()=>{
        wrapper = shallow(<EmptyTaskItem {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
